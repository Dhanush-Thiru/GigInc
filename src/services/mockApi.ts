import { predictPremium, calculatePremiumActuarial, isPremiumModelReady, type PremiumProfile } from './mlEngine';

export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Map auth-page form values → PremiumProfile expected by mlEngine
function buildProfile(data: {
  dailyIncome: number;
  vehicle: string;
  zone: string;
  persona: string;
  age?: number;
  ratings?: number;
}): PremiumProfile {
  // City tier from zone string
  const zone = data.zone.toLowerCase();
  let city = 'Urban';
  if (zone.includes('mumbai') || zone.includes('delhi') || zone.includes('bangalore') ||
      zone.includes('bengaluru') || zone.includes('chennai') || zone.includes('hyderabad') ||
      zone.includes('kolkata') || zone.includes('pune')) {
    city = 'Metropolitian';
  } else if (zone.includes('surat') || zone.includes('jaipur') || zone.includes('lucknow') ||
             zone.includes('nagpur') || zone.includes('indore')) {
    city = 'Urban';
  } else {
    city = 'Semi-Urban';
  }

  // Vehicle mapping from form values → dataset values
  const vehicleMap: Record<string, string> = {
    bike: 'motorcycle',
    motorcycle: 'motorcycle',
    scooter: 'scooter',
    electric_scooter: 'electric_scooter',
    cycle: 'bicycle',
    bicycle: 'bicycle',
  };
  const vehicle = vehicleMap[data.vehicle] ?? 'motorcycle';

  // Persona → night shift + traffic proxy
  const isNightShift = data.persona === 'night_owl';
  const traffic      = data.persona === 'hustler' ? 'High' : data.persona === 'night_owl' ? 'Medium' : 'Low';

  // Experience tier from income (proxy — higher income = more experienced)
  const experienceTier =
    data.dailyIncome > 700 ? 3 :
    data.dailyIncome > 550 ? 2 :
    data.dailyIncome > 400 ? 1 : 0;

  return {
    age:                data.age     ?? 28,
    ratings:            data.ratings ?? 4.2,
    vehicleCondition:   2,
    multipleDeliveries: data.persona === 'hustler' ? 2 : 1,
    festival:           false,
    isNightShift,
    distanceKm:         5,
    experienceTier,
    city,
    weather:            'Cloudy',
    traffic,
    vehicle,
    timeOfDay:          isNightShift ? 'Night' : 'Evening',
  };
}

export const mockApi = {
  // ML-powered premium calculation — async, falls back to actuarial rules
  calculatePremium: async (data: {
    dailyIncome: number;
    vehicle: string;
    zone: string;
    persona: string;
    age?: number;
    ratings?: number;
  }): Promise<number> => {
    const profile = buildProfile(data);

    if (isPremiumModelReady()) {
      try {
        return await predictPremium(profile);
      } catch (e) {
        console.warn('[InsureGig] ML prediction failed, using actuarial fallback:', e);
      }
    }

    return calculatePremiumActuarial(profile);
  },

  checkFraud: (gpsCoords: { lat: number; lon: number }, ipCoords: { lat: number; lon: number }) => {
    const distance = getDistanceFromLatLonInKm(gpsCoords.lat, gpsCoords.lon, ipCoords.lat, ipCoords.lon);
    return {
      isValid: distance <= 50,
      distance: Math.round(distance * 10) / 10,
    };
  },

  processClaim: (
    worker: { dailyIncome: number; premiumPaid: number; platform: string },
    event: { disruptionType: string; severity: number; demandLevel: number }
  ) => {
    const hourlyIncome = worker.dailyIncome / 10;
    const hoursLost    = Math.max(1, Math.round(event.severity * 5));

    const expectedIncomeWithoutDisruption = Math.round(hoursLost * hourlyIncome * 1.5);
    const actualIncomeWithDisruption      = Math.round(expectedIncomeWithoutDisruption * event.demandLevel);
    const expectedLoss                    = expectedIncomeWithoutDisruption - actualIncomeWithDisruption;

    const maxPayout = worker.premiumPaid * 15;
    const payout    = Math.min(expectedLoss, maxPayout);

    const dropPercentage = Math.round((1 - event.demandLevel) * 100);

    let disruptionText = '';
    if (event.disruptionType === 'weather')
      disruptionText = `the high weather severity (${Math.round(event.severity * 100)}%)`;
    else if (event.disruptionType === 'platform_outage')
      disruptionText = `a massive ${worker.platform} server outage (${Math.round(event.severity * 100)}% offline)`;
    else if (event.disruptionType === 'traffic')
      disruptionText = `severe traffic gridlock / road closures (${Math.round(event.severity * 100)}% severity)`;
    else if (event.disruptionType === 'aqi')
      disruptionText = `hazardous Air Quality levels (${Math.round(event.severity * 100)}% AQI severity)`;
    else
      disruptionText = `a severe disruption event (${Math.round(event.severity * 100)}% severity)`;

    return {
      hoursLost,
      expectedIncomeWithoutDisruption,
      actualIncomeWithDisruption,
      expectedLoss,
      payout,
      approved: true,
      disruptionType: event.disruptionType,
      explanation: `Counterfactual analysis complete: If conditions were normal, you would have earned ₹${expectedIncomeWithoutDisruption} over these ${hoursLost} peak hours. However, due to ${disruptionText} triggering a massive ${dropPercentage}% drop in your effective delivery capacity, your expected earnings plummeted to just ₹${actualIncomeWithDisruption}. This results in a verified income loss of ₹${expectedLoss}. To make you whole, InsureGig is instantly issuing a parametric payout of ₹${payout}.`,
    };
  },
};
