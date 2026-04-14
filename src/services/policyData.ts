import { AlertTriangle, Car, Cloud, Smartphone, Wind } from "lucide-react";

const CLAIM_HISTORY_KEY = "claimHistory";
const DISRUPTION_HISTORY_KEY = "disruptionHistory";

export interface StoredUserProfile {
  name?: string;
  email?: string;
  phone?: string;
  platform?: string;
  location?: string;
  vehicle?: string;
  dailyIncome?: number;
  premiumPaid?: number;
  premiumStatus?: string;
  paymentId?: string;
  planType?: string;
}

export interface StoredClaimRecord {
  id: string;
  date: string;
  disruptionType: string;
  payout: number;
  hoursLost: number;
  expectedIncomeWithoutDisruption: number;
  actualIncomeWithDisruption: number;
  expectedLoss: number;
  approved: boolean;
  explanation: string;
}

export interface StoredDisruptionRecord {
  id: string;
  date: string;
  disruptionType: string;
  severity: number;
  demandLevel: number;
  payout: number;
  hoursLost: number;
  status: "Completed" | "Blocked";
  source: string;
  description: string;
}

import { supabase } from "./supabaseClient";

export async function getStoredUserProfile(): Promise<StoredUserProfile> {
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
       const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
       if (data) return data;
    }
  }
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export async function getStoredClaimHistory(): Promise<StoredClaimRecord[]> {
  if (supabase) {
    const { data } = await supabase.from('claims').select('*').order('date', { ascending: true });
    if (data) return data as StoredClaimRecord[];
  }
  try {
    const saved = localStorage.getItem(CLAIM_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export async function getStoredDisruptionHistory(): Promise<StoredDisruptionRecord[]> {
  if (supabase) {
    const { data } = await supabase.from('disruptions').select('*').order('date', { ascending: true });
    if (data) return data as StoredDisruptionRecord[];
  }
  try {
    const saved = localStorage.getItem(DISRUPTION_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export async function saveStoredClaimHistory(records: StoredClaimRecord[]) {
  if (supabase) {
     // For simplicity in sync logic, upsert all
     const { error } = await supabase.from('claims').upsert(records);
     if (error) console.error("Supabase claims error:", error);
  }
  localStorage.setItem(CLAIM_HISTORY_KEY, JSON.stringify(records));
}

export async function saveStoredDisruptionHistory(records: StoredDisruptionRecord[]) {
  if (supabase) {
    const { error } = await supabase.from('disruptions').upsert(records);
    if (error) console.error("Supabase disruptions error:", error);
  }
  localStorage.setItem(DISRUPTION_HISTORY_KEY, JSON.stringify(records));
}

export async function clearStoredClaimData() {
  if (supabase) {
    await supabase.from('claims').delete().neq('id', '0'); // Delete all
    await supabase.from('disruptions').delete().neq('id', '0');
  }
  localStorage.removeItem(CLAIM_HISTORY_KEY);
  localStorage.removeItem(DISRUPTION_HISTORY_KEY);
}


export function getDisruptionLabel(type: string) {
  switch (type) {
    case "weather":
      return "Heavy Rain";
    case "platform_outage":
      return "Platform Outage";
    case "traffic":
      return "Traffic Gridlock";
    case "aqi":
      return "Poor AQI";
    default:
      return "Disruption";
  }
}

export function getDisruptionDescription(type: string, severity: number, demandLevel: number) {
  const severityText = `${Math.round(severity)}% severity`;
  const demandText = `${Math.round(demandLevel)}% demand left`;

  switch (type) {
    case "weather":
      return `Weather trigger reached ${severityText} with ${demandText}.`;
    case "platform_outage":
      return `Platform outage reached ${severityText} with ${demandText}.`;
    case "traffic":
      return `Traffic disruption reached ${severityText} with ${demandText}.`;
    case "aqi":
      return `AQI trigger reached ${severityText} with ${demandText}.`;
    default:
      return `Disruption reached ${severityText} with ${demandText}.`;
  }
}

export function getDisruptionSource(type: string) {
  switch (type) {
    case "weather":
      return "Weather API";
    case "platform_outage":
      return "Platform Status API";
    case "traffic":
      return "Traffic Maps API";
    case "aqi":
      return "AQI Sensor API";
    default:
      return "Disruption API";
  }
}

export function getDisruptionIcon(type: string) {
  switch (type) {
    case "weather":
      return Cloud;
    case "platform_outage":
      return Smartphone;
    case "traffic":
      return Car;
    case "aqi":
      return Wind;
    default:
      return AlertTriangle;
  }
}
