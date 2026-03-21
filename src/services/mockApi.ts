export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const mockApi = {
  calculatePremium: (data: { dailyIncome: number; vehicle: string; zone: string; persona: string }) => {
    // New rule: Start with Rs 49 base price
    let basePrice = 49;
    
    let multiplier = 1.0;
    
    // Differing according to calculation of different areas
    const zone = data.zone.toLowerCase();
    if (zone.includes('mumbai')) {
      multiplier += 0.40; // High sea-level/rain risk
    } else if (zone.includes('bangalore') || zone.includes('bengaluru')) {
      multiplier += 0.30; // High traffic congestion
    } else if (zone.includes('delhi')) {
      multiplier += 0.35; // Extreme temperatures / AQI
    } else {
      multiplier += 0.15; // Standard metropolitan risk
    }
    
    if (data.vehicle === 'cycle') multiplier *= 0.85;
    
    switch(data.persona) {
      case 'night_owl': multiplier *= 1.25; break; 
      case 'hustler': multiplier *= 1.15; break; 
      case 'fair_weather': multiplier *= 0.85; break; 
    }
    
    return Math.round(basePrice * multiplier);
  },

  checkFraud: (gpsCoords: { lat: number, lon: number }, ipCoords: { lat: number, lon: number }) => {
    const distance = getDistanceFromLatLonInKm(gpsCoords.lat, gpsCoords.lon, ipCoords.lat, ipCoords.lon);
    return {
      isValid: distance <= 50,
      distance: Math.round(distance * 10) / 10,
    };
  },

  processClaim: (worker: { dailyIncome: number, premiumPaid: number, platform: string }, event: { disruptionType: string, severity: number, demandLevel: number }) => {
    const hourlyIncome = worker.dailyIncome / 10; 
    const hoursLost = Math.max(1, Math.round(event.severity * 5)); 
    
    // 1. How much would the person have earned if disruption didn't happen
    const expectedIncomeWithoutDisruption = Math.round(hoursLost * hourlyIncome * 1.5); 
    
    // 2. How much did they actually earn given the current low demand level
    const actualIncomeWithDisruption = Math.round(expectedIncomeWithoutDisruption * event.demandLevel);
    
    // 3. The exact loss gap
    const expectedLoss = expectedIncomeWithoutDisruption - actualIncomeWithDisruption;
    
    // Premium acts as a payout cap. Increase cap multiplier to 15x so huge payouts don't clip arbitrarily for the demo
    const maxPayout = worker.premiumPaid * 15;
    const payout = Math.min(expectedLoss, maxPayout);
    
    const dropPercentage = Math.round((1 - event.demandLevel) * 100);

    let disruptionText = "";
    if (event.disruptionType === "weather") disruptionText = `the high weather severity (${Math.round(event.severity*100)}%)`;
    else if (event.disruptionType === "platform_outage") disruptionText = `a massive ${worker.platform} server outage (${Math.round(event.severity*100)}% offline)`;
    else if (event.disruptionType === "traffic") disruptionText = `severe traffic gridlock / road closures (${Math.round(event.severity*100)}% severity)`;
    else if (event.disruptionType === "aqi") disruptionText = `hazardous Air Quality levels (${Math.round(event.severity*100)}% AQI severity)`;
    else disruptionText = `a severe disruption event (${Math.round(event.severity*100)}% severity)`;


    return {
      hoursLost,
      expectedIncomeWithoutDisruption,
      actualIncomeWithDisruption,
      expectedLoss,
      payout,
      approved: true,
      disruptionType: event.disruptionType,
      explanation: `Counterfactual analysis complete: If conditions were normal, you would have earned ₹${expectedIncomeWithoutDisruption} over these ${hoursLost} peak hours. However, due to ${disruptionText} triggering a massive ${dropPercentage}% drop in your effective delivery capacity, your expected earnings plummeted to just ₹${actualIncomeWithDisruption}. This results in a verified income loss of ₹${expectedLoss}. To make you whole, InsureGig is instantly issuing a parametric payout of ₹${payout}.`
    };
  }
};
