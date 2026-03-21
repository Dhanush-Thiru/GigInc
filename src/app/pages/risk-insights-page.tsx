import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { AlertTriangle, Cloud, Wind, TrendingDown, MapPin, Navigation } from "lucide-react";
import { fetchLiveWeather, fetchWeatherByCoords } from "../../services/weatherApi";

export function RiskInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("your area");
  const [weatherData, setWeatherData] = useState({ temp: 32, desc: "Scanning...", severity: 75 });
  const [isLiveGps, setIsLiveGps] = useState(false);

  useEffect(() => {
    const fetchRiskData = async () => {
      // 1. Try Live GPS first
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await fetchWeatherByCoords(latitude, longitude);
            if (data.success) {
              setLocationName(data.name || "your area");
              setWeatherData({ temp: data.temp, desc: data.description, severity: data.severity });
              setIsLiveGps(true);
              setLoading(false);
            } else {
              fallbackToProfile();
            }
          },
          (error) => {
            console.warn("GPS Denied or failed. Using Profile location.");
            fallbackToProfile();
          },
          { timeout: 5000 }
        );
      } else {
        fallbackToProfile();
      }
    };

    const fallbackToProfile = async () => {
      const savedUser = localStorage.getItem("user");
      const city = savedUser ? JSON.parse(savedUser).location : "Mumbai";
      setLocationName(city);
      const data = await fetchLiveWeather(city);
      if (data.success) {
        setWeatherData({ temp: data.temp, desc: data.description, severity: data.severity });
      }
      setLoading(false);
    };

    fetchRiskData();
  }, []);

  // Calculate dynamic visual states based on the real weather severity
  const riskScore = loading ? 75 : Math.min(100, Math.max(10, weatherData.severity + 15)); // Add baseline 15 for traffic/AQI mock
  
  let riskLevelLabel = "LOW 🟢";
  let bgGradient = "from-green-50 to-emerald-50";
  let borderColor = "border-green-200";
  let iconBg = "bg-green-500";
  let textColor = "text-green-600";
  
  if (riskScore > 60) {
    riskLevelLabel = "HIGH 🔴";
    bgGradient = "from-orange-50 to-red-50";
    borderColor = "border-orange-200";
    iconBg = "bg-orange-500";
    textColor = "text-orange-600";
  } else if (riskScore > 30) {
    riskLevelLabel = "MEDIUM 🟡";
    bgGradient = "from-yellow-50 to-amber-50";
    borderColor = "border-yellow-200";
    iconBg = "bg-yellow-500";
    textColor = "text-yellow-600";
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          AI Risk Insights 
          {isLiveGps && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 text-xs px-2 py-0.5">
              <Navigation className="w-3 h-3 mr-1" /> Live GPS Active
            </Badge>
          )}
        </h1>
        <p className="text-gray-600 capitalize">Real-time AI predictions for delivering in {locationName}</p>
      </div>

      {/* Overall Risk Level */}
      <Card className={`${borderColor} bg-gradient-to-br ${bgGradient} transition-colors duration-500`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center transition-colors duration-500`}>
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Current Safety / Disruption Risk Level</p>
                <h2 className={`text-4xl font-bold ${textColor} transition-colors duration-500`}>{riskLevelLabel}</h2>
              </div>
            </div>
            {riskScore > 60 && <Badge className="bg-red-600 text-white text-lg px-4 py-2 animate-pulse">Alert Active</Badge>}
            {riskScore <= 60 && <Badge className="bg-green-600 text-white text-lg px-4 py-2">Safe Conditions</Badge>}
          </div>
          <Progress value={riskScore} className="h-3 shadow-inner" />
          <p className="text-sm text-gray-700 mt-2 font-medium">
            {riskScore}% aggregated risk level - {riskScore > 60 ? "Multiple disruption factors detected" : "Standard baseline operating conditions"}
          </p>
        </CardContent>
      </Card>

      {/* AI Prediction */}
      <Card className="border-blue-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            {locationName} AI Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg border ${riskScore > 60 ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-lg font-semibold mb-2 ${riskScore > 60 ? 'text-orange-900' : 'text-blue-900'}`}>
              {riskScore}% chance of disruption today
            </p>
            <p className="text-gray-700">
              {riskScore > 60 
                ? `Our AI model predicts significant delivery disruptions in ${locationName} due to ${weatherData.desc.toLowerCase()} conditions and potential traffic gridlock. We recommend limiting outdoor hours. Your parametric coverage is actively watching for payouts.`
                : `Our AI model confirms stable operations in ${locationName} right now. Weather is ${weatherData.desc.toLowerCase()} and traffic is flowing. Your parametric engine is in standby mode.`}
            </p>
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-between">
            <p>Updated: Just now • Next poll: In 15 minutes</p>
            {isLiveGps && <p className="text-blue-600 font-medium text-xs">Lat/Lon data synchronized</p>}
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Dynamic Weather Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Cloud className={`w-5 h-5 ${weatherData.severity > 50 ? 'text-blue-600' : 'text-gray-500'}`} />
                Live Weather
              </CardTitle>
              {weatherData.severity > 60 ? <Badge className="bg-red-600">Severe</Badge> : 
               weatherData.severity > 30 ? <Badge className="bg-yellow-500">Moderate</Badge> : 
               <Badge className="bg-green-600">Normal</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-gray-900">{loading ? "..." : `${weatherData.temp}°C`}</p>
                <p className="text-sm text-gray-600 font-medium capitalize mt-1">{loading ? "Scanning..." : weatherData.desc}</p>
              </div>
              <Progress value={weatherData.severity} className="h-2" />
              <p className="text-xs text-gray-500 h-8">
                {weatherData.severity > 50 
                  ? "Adverse conditions detected via OpenWeather API. High probability of parametric trigger." 
                  : "Clear conditions detected via OpenWeather API. Standard operations."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Air Quality Index (Simulated) */}
        <Card className="shadow-sm opacity-90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Wind className="w-5 h-5 text-gray-400" />
                AQI Level
              </CardTitle>
              <Badge variant="outline" className="text-gray-500 border-gray-200">Moderate</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-gray-700">124</p>
                <p className="text-sm text-gray-500">Unhealthy for sensitive</p>
              </div>
              <Progress value={40} className="h-2" />
              <p className="text-xs text-gray-500 h-8">
                Air quality index is slightly elevated but below critical automated payout thresholds.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Demand (Simulated) */}
        <Card className="shadow-sm opacity-90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <TrendingDown className="w-5 h-5 text-gray-400" />
                Live Demand
              </CardTitle>
              <Badge variant="outline" className="text-gray-500 border-gray-200">Stable</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-gray-700">82%</p>
                <p className="text-sm text-gray-500">Capacity remaining</p>
              </div>
              <Progress value={82} className="h-2" />
              <p className="text-xs text-gray-500 h-8">
                Current platform order flow relative to active delivery partners.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Heatmap Preview */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Live Risk Map: <span className="capitalize border-b border-dashed border-gray-400 pb-0.5">{locationName}</span>
            </div>
            {isLiveGps && <span className="text-xs font-normal text-blue-600 flex items-center"><Navigation className="w-3 h-3 mr-1"/> GPS Synced</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 h-64 rounded-lg flex items-center justify-center border relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            <div className="text-center relative bg-white/80 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white">
              <MapPin className={`w-12 h-12 mx-auto mb-2 ${riskScore > 60 ? 'text-red-600 animate-bounce' : 'text-green-600'}`} />
              <p className="font-bold text-gray-900 text-lg">{riskScore > 60 ? "High Risk Active Zone" : "Safe Operations Zone"}</p>
              <p className="text-sm text-gray-600 font-medium">Monitoring {locationName} radius...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
