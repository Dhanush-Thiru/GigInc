import * as tf from '@tensorflow/tfjs';

let insuranceModel: tf.LayersModel | null = null;
let isTraining = false;

/**
 * 1. GENERATE SYNTHETIC TRAINING DATA
 * For the hackathon, we simulate 3,000 past disruption events where a
 * Gig Worker lost income due to Weather Severity and Demand Drops.
 * We add statistical noise to make it a realistic dataset.
 */
export function generateTrainingData(samples = 3000) {
  const xs: number[][] = [];
  const ys: number[][] = [];
  
  for (let i = 0; i < samples; i++) {
    // Randomize features
    const severity = Math.random(); // 0 to 1 (0% to 100% severe weather/traffic)
    const demand = Math.random();   // 0 to 1 (0% to 100% platform demand left)
    
    // The true algorithmic relationship underneath the data:
    // Higher severity and lower demand equals a higher percentage of income lost.
    let baseLoss = (severity * 0.6) + ((1 - demand) * 0.4);
    
    // Inject +/- 15% random noise so the Neural Network actually has to "learn" the line of best fit!
    baseLoss += (Math.random() * 0.3 - 0.15); 
    
    // Bound the target between 0 and 1
    const actualLossMultiplier = Math.max(0, Math.min(1, baseLoss));
    
    // X = Features, Y = Target
    xs.push([severity, demand]);
    ys.push([actualLossMultiplier]);
  }
  
  return {
    inputs: tf.tensor2d(xs),
    labels: tf.tensor2d(ys)
  };
}

/**
 * 2. TRAIN THE MULTI-LAYER PERCEPTRON NEURAL NETWORK
 * This runs directly in the user's browser via WebGL.
 */
export async function trainInsuranceModel(onProgress?: (epoch: number, loss: number) => void) {
  if (isTraining) return false;
  isTraining = true;
  
  console.log("Generating 3,000 synthetic historical claims...");
  const { inputs, labels } = generateTrainingData(3000);
  
  console.log("Building TF.js Sequential Model...");
  const model = tf.sequential();
  
  // Hidden Layer 1 (16 Nodes)
  model.add(tf.layers.dense({ inputShape: [2], units: 16, activation: 'relu' }));
  // Hidden Layer 2 (8 Nodes)
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  // Output Layer (1 Node: The exact percentage of income lost)
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); 
  
  model.compile({
    optimizer: tf.train.adam(0.02), // Adam optimizer for fast convergence in the browser
    loss: 'meanSquaredError'
  });
  
  console.log("Training Model over 50 Epochs...");
  
  await model.fit(inputs, labels, {
    epochs: 50,
    batchSize: 128,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress && logs) {
          onProgress(epoch + 1, logs.loss); // Callback to update the React UI Live!
        }
      }
    }
  });
  
  insuranceModel = model;
  isTraining = false;
  
  // Free up WebGL memory
  inputs.dispose();
  labels.dispose();
  
  return true;
}

export function isModelReady() {
  return insuranceModel !== null;
}

/**
 * 3. PREDICT COUNTERFACTUAL PAYOUT
 * Pass the real-time API values into the trained Neural Web to get a dynamic prediction
 */
export async function predictDisruptionLoss(severityScore: number, demandPercentage: number) {
  if (!insuranceModel) {
    throw new Error("Cannot predict: Model not trained yet! Please initialize the AI engine.");
  }
  
  // Normalize inputs back to 0-1 scale used during training
  const s = severityScore / 100.0;
  const d = demandPercentage / 100.0;
  
  const inputTensor = tf.tensor2d([[s, d]]);
  const prediction = insuranceModel.predict(inputTensor) as tf.Tensor;
  
  // Get output value (0 to 1) representing percent of wages lost
  const lossPercentageArray = await prediction.data();
  const lossPercentage = lossPercentageArray[0];
  
  inputTensor.dispose();
  prediction.dispose();
  
  return lossPercentage;
}
