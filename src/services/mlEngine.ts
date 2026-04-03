import * as tf from '@tensorflow/tfjs';

// ─── Disruption model (in-browser, synthetic) ────────────────────────────────
let insuranceModel: tf.LayersModel | null = null;
let isTraining = false;

// ─── Premium model (pretrained on real data, loaded from public/) ─────────────
let premiumModel: tf.LayersModel | null = null;
let premiumModelLoading = false;

// Encoding maps — MUST match InsureGig_Colab.ipynb exactly
const CITY_ENC:    Record<string, number> = { Metropolitian: 1.0, Urban: 0.5, 'Semi-Urban': 0.0 };
const WEATHER_ENC: Record<string, number> = { Sunny: 0.0, Cloudy: 0.17, Windy: 0.33, Fog: 0.50, Sandstorms: 0.67, Stormy: 1.0 };
const TRAFFIC_ENC: Record<string, number> = { Low: 0.0, Medium: 0.33, High: 0.67, Jam: 1.0 };
const VEHICLE_ENC: Record<string, number> = { electric_scooter: 0.0, bicycle: 0.33, scooter: 0.67, motorcycle: 1.0 };
const TOD_ENC:     Record<string, number> = { Morning: 0.0, Afternoon: 0.33, Evening: 0.67, Night: 1.0 };

const CITY_INCOME: Record<string, number> = { Metropolitian: 700, Urban: 550, 'Semi-Urban': 420 };

export interface PremiumProfile {
  age: number;
  ratings: number;
  vehicleCondition: number;     // 0–3
  multipleDeliveries: number;   // 0–3
  festival: boolean;
  isNightShift: boolean;
  distanceKm: number;
  experienceTier: number;       // 0–3
  city: string;                 // 'Metropolitian' | 'Urban' | 'Semi-Urban'
  weather: string;              // 'Sunny' | 'Cloudy' | 'Windy' | 'Fog' | 'Sandstorms' | 'Stormy'
  traffic: string;              // 'Low' | 'Medium' | 'High' | 'Jam'
  vehicle: string;              // 'motorcycle' | 'scooter' | 'electric_scooter' | 'bicycle'
  timeOfDay: string;            // 'Morning' | 'Afternoon' | 'Evening' | 'Night'
}

// ─── Load pretrained premium model from public/premium_model/ ────────────────
export async function loadPremiumModel(): Promise<boolean> {
  if (premiumModel) return true;
  if (premiumModelLoading) return false;
  premiumModelLoading = true;

  try {
    premiumModel = await tf.loadLayersModel('/premium_model/model.json');
    console.log('[InsureGig] Pretrained premium model loaded from real data.');
    premiumModelLoading = false;
    return true;
  } catch (err) {
    console.warn('[InsureGig] Pretrained model not found, will use actuarial rules.', err);
    premiumModelLoading = false;
    return false;
  }
}

export function isPremiumModelReady(): boolean {
  return premiumModel !== null;
}

// ─── Build 14-feature vector (identical order to Colab build_features) ────────
function buildFeatureVector(profile: PremiumProfile): number[] {
  const dailyIncome = Math.max(200, Math.min(1200,
    (CITY_INCOME[profile.city] ?? 500)
    + profile.multipleDeliveries * 80
    + (profile.festival ? 150 : 0)
    + (profile.isNightShift ? 80 : 0)
    - (2 - profile.vehicleCondition) * 30
  ));

  return [
    (Math.min(Math.max(profile.age, 15), 60) - 15) / 45.0,
    (Math.min(Math.max(profile.ratings, 1), 5) - 1.0) / 4.0,
    Math.min(profile.vehicleCondition, 3) / 3.0,
    Math.min(profile.multipleDeliveries, 3) / 3.0,
    profile.festival ? 1.0 : 0.0,
    profile.isNightShift ? 1.0 : 0.0,
    Math.min(profile.distanceKm, 30) / 30.0,
    Math.min(profile.experienceTier, 3) / 3.0,
    CITY_ENC[profile.city]    ?? 0.5,
    WEATHER_ENC[profile.weather]  ?? 0.33,
    TRAFFIC_ENC[profile.traffic]  ?? 0.33,
    VEHICLE_ENC[profile.vehicle]  ?? 0.5,
    TOD_ENC[profile.timeOfDay]    ?? 0.33,
    dailyIncome / 1200.0,
  ];
}

// ─── Predict premium using pretrained model ───────────────────────────────────
export async function predictPremium(profile: PremiumProfile): Promise<number> {
  if (!premiumModel) {
    throw new Error('Premium model not loaded. Call loadPremiumModel() first.');
  }

  const features = buildFeatureVector(profile);
  const inputTensor = tf.tensor2d([features]);
  const output = premiumModel.predict(inputTensor) as tf.Tensor;
  const result = await output.data();

  inputTensor.dispose();
  output.dispose();

  return Math.max(49, Math.round(result[0]));
}

// ─── Actuarial fallback (no model needed) ────────────────────────────────────
export function calculatePremiumActuarial(profile: PremiumProfile): number {
  const CITY_MULT:    Record<string, number> = { Metropolitian: 1.40, Urban: 1.20, 'Semi-Urban': 1.00 };
  const WEATHER_MULT: Record<string, number> = { Stormy: 1.60, Sandstorms: 1.50, Fog: 1.40, Windy: 1.10, Cloudy: 1.05, Sunny: 1.00 };
  const TRAFFIC_MULT: Record<string, number> = { Jam: 1.50, High: 1.30, Medium: 1.10, Low: 1.00 };
  const VEHICLE_MULT: Record<string, number> = { bicycle: 1.25, scooter: 1.10, motorcycle: 1.00, electric_scooter: 0.95 };

  let p = 49;
  p *= CITY_MULT[profile.city]       ?? 1.15;
  p *= WEATHER_MULT[profile.weather] ?? 1.05;
  p *= TRAFFIC_MULT[profile.traffic] ?? 1.10;
  p *= VEHICLE_MULT[profile.vehicle] ?? 1.00;
  p *= [1.00, 1.15, 1.25, 1.30][Math.min(profile.multipleDeliveries, 3)];
  p *= profile.festival ? 1.20 : 1.00;
  p *= profile.age < 22 ? 1.20 : profile.age > 45 ? 1.10 : profile.age > 35 ? 1.10 : 1.00;
  p *= profile.ratings > 4.5 ? 0.90 : profile.ratings < 4.0 ? 1.15 : 1.00;
  p *= profile.isNightShift ? 1.25 : 1.00;
  p *= [1.20, 1.10, 1.00, 0.90][Math.min(profile.experienceTier, 3)];
  return Math.max(49, Math.round(p));
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISRUPTION LOSS MODEL — in-browser synthetic training (unchanged)
// Used by claims-page.tsx for the parametric payout simulation
// ═══════════════════════════════════════════════════════════════════════════════

export function generateTrainingData(samples = 3000) {
  const xs: number[][] = [];
  const ys: number[][] = [];

  for (let i = 0; i < samples; i++) {
    const severity = Math.random();
    const demand   = Math.random();
    let baseLoss   = severity * 0.6 + (1 - demand) * 0.4;
    baseLoss      += Math.random() * 0.3 - 0.15;
    xs.push([severity, demand]);
    ys.push([Math.max(0, Math.min(1, baseLoss))]);
  }

  return { inputs: tf.tensor2d(xs), labels: tf.tensor2d(ys) };
}

export async function trainInsuranceModel(onProgress?: (epoch: number, loss: number) => void) {
  if (isTraining) return false;
  isTraining = true;

  const { inputs, labels } = generateTrainingData(3000);
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [2], units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({ optimizer: tf.train.adam(0.02), loss: 'meanSquaredError' });

  await model.fit(inputs, labels, {
    epochs: 50,
    batchSize: 128,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress && logs) onProgress(epoch + 1, logs.loss);
      }
    }
  });

  insuranceModel = model;
  isTraining = false;
  inputs.dispose();
  labels.dispose();
  return true;
}

export function isModelReady() {
  return insuranceModel !== null;
}

export async function predictDisruptionLoss(severityScore: number, demandPercentage: number) {
  if (!insuranceModel) {
    throw new Error('Disruption model not trained yet.');
  }

  const inputTensor = tf.tensor2d([[severityScore / 100.0, demandPercentage / 100.0]]);
  const prediction  = insuranceModel.predict(inputTensor) as tf.Tensor;
  const result      = await prediction.data();

  inputTensor.dispose();
  prediction.dispose();
  return result[0];
}
