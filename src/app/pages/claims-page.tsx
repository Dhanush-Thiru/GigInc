import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CheckCircle, Cloud, Clock, TrendingUp, Wallet, ShieldCheck, Activity, Settings2, History, RefreshCw, Smartphone, Car, Wind, AlertTriangle, MapPin, BrainCircuit } from "lucide-react";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { mockApi } from "../../services/mockApi";
import { fetchLiveWeather } from "../../services/weatherApi";
import { trainInsuranceModel, predictDisruptionLoss, isModelReady } from "../../services/mlEngine";
import { toast } from "sonner";

const spoofLocations = {
  "Delhi": { lat: 28.7041, lon: 77.1025, name: "New Delhi, India" },
  "Bangalore": { lat: 12.9716, lon: 77.5946, name: "Bangalore, India" },
  "London": { lat: 51.5074, lon: -0.1278, name: "London, UK" },
  "New_York": { lat: 40.7128, lon: -74.0060, name: "New York, USA" }
};

export function ClaimsPage() {
  const [demoState, setDemoState] = useState<"idle" | "simulating" | "fraud_check" | "fraud_failed" | "calculating" | "done">("idle");
  
  const [user, setUser] = useState<any>({ name: "Rider", dailyIncome: 600, premiumPaid: 65, location: "Mumbai", platform: "Swiggy" });
  
  const [disruptionType, setDisruptionType] = useState("weather");
  const [severity, setSeverity] = useState([80]); 
  const [demandLevel, setDemandLevel] = useState([4]); 
  
  const [simulateFraud, setSimulateFraud] = useState(false);
  const [spoofedCity, setSpoofedCity] = useState("New_York");
  
  // TensorFlow ML States
  const [isTrainingMl, setIsTrainingMl] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState({ epoch: 0, loss: 0 });
  
  const [fraudResult, setFraudResult] = useState<any>(null);
  const [claimResult, setClaimResult] = useState<any>(null);
  const [claimHistory, setClaimHistory] = useState<any[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);

  const clearHistory = () => {
    localStorage.removeItem("claimHistory");
    setClaimHistory([]);
    toast.success("Wallet history completely reset.");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const history = localStorage.getItem("claimHistory");
    if (history) {
      setClaimHistory(JSON.parse(history));
    }
  }, []);

  const handleFetchLiveWeather = async () => {
    if (!user?.location) return toast.error("No location set for user profile.");
    setIsFetchingWeather(true);

    toast.info(`Fetching live openweathermap data for ${user.location}...`);

    try {
      const data = await fetchLiveWeather(user.location);
      if (data.success) {
        setSeverity([data.severity]);

        // Automating the Demand Drop based on Weather Severity
        const autoDemand = Math.max(5, Math.round(100 - (data.severity * 1.2)));
        setDemandLevel([autoDemand]);

        toast.success(`Live Weather: ${data.description} (${data.temp}°C). Severity: ${data.severity}%. Platform Capacity dropped to ${autoDemand}%`);
      } else {
        toast.error("Failed to fetch live API. Using mock fallback. " + (data.error || ""));
      }
    } catch (e) {
      toast.error("Network error fetching live weather.");
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const handleTrainModel = async () => {
    setIsTrainingMl(true);
    toast.info("Generating 3,000 synthetic historical claims...");
    
    // Pass callback to update Epoch UI live!
    await trainInsuranceModel((epoch, loss) => {
      setTrainingProgress({ epoch, loss });
    });
    
    setIsTrainingMl(false);
    toast.success("Neural Network actively generating predictions.");
  };

  const runDemo = () => {
    setDemoState("simulating");
    setClaimResult(null);
    setFraudResult(null);

    setTimeout(() => {
      setDemoState("fraud_check");

      const baseCoords = { lat: 19.0760, lon: 72.8777 }; // Assume IP reflects real base (Mumbai)
      const spoofCoords = simulateFraud
        ? spoofLocations[spoofedCity as keyof typeof spoofLocations]
        : { lat: 19.0770, lon: 72.8780 }; // Normal 0.1km variance for valid claims!

      const fraud = mockApi.checkFraud(spoofCoords, baseCoords);
      setFraudResult({ ...fraud, spoofedDetails: spoofCoords });

      // Branching logic based on the AI fraud engine output
      if (!fraud.isValid) {
        setTimeout(() => setDemoState("fraud_failed"), 2000);
      } else {
        setTimeout(async () => {
          setDemoState("calculating");
          
          let payoutResult;
          
          if (isModelReady()) {
            // 🧠 USE THE TENSORFLOW NEURAL NETWORK!
            const lostWagePercentage = await predictDisruptionLoss(severity[0], demandLevel[0]);
            
            const baseIncome = user.dailyIncome || 500;
            const actualIncome = Math.round(baseIncome * (demandLevel[0] / 100));
            const calculatedLoss = baseIncome - actualIncome;
            
            let mlPredictedPayout = Math.round(baseIncome * lostWagePercentage);
            mlPredictedPayout = Math.max(0, Math.min(mlPredictedPayout, calculatedLoss)); // Bound it logically
            
            payoutResult = {
              disruptionType,
              expectedIncomeWithoutDisruption: baseIncome,
              actualIncomeWithDisruption: actualIncome,
              hoursLost: Math.round((1 - (demandLevel[0]/100)) * 8),
              payout: mlPredictedPayout,
              explanation: `[TensorFlow.js AI Prediction] Our in-browser Neural Network processed the ${severity[0]}% severity and ${demandLevel[0]}% platform demand through 50 epochs of historical precedence, predicting a true counterfactual loss of ₹${mlPredictedPayout}.`
            };
          } else {
            // 🔢 USE THE HARDCODED MATH FALLBACK
            payoutResult = mockApi.processClaim(
              { dailyIncome: user.dailyIncome || 500, premiumPaid: user.premiumPaid || 45, platform: user.platform || "App" },
              { disruptionType, severity: severity[0] / 100, demandLevel: demandLevel[0] / 100 }
            );
          }
          
          setClaimResult(payoutResult);

          setClaimHistory(prev => {
            const newHistory = [...prev, { ...payoutResult, date: new Date().toISOString() }];
            localStorage.setItem("claimHistory", JSON.stringify(newHistory));
            return newHistory;
          });

          setTimeout(() => setDemoState("done"), 2000);
        }, 2000);
      }
    }, 1500);
  };

  const getDisruptionIcon = (type: string, className = "w-5 h-5") => {
    switch (type) {
      case "weather": return <Cloud className={className} />;
      case "platform_outage": return <Smartphone className={className} />;
      case "traffic": return <Car className={className} />;
      case "aqi": return <Wind className={className} />;
      default: return <Cloud className={className} />;
    }
  }

  const getDisruptionName = (type: string) => {
    switch (type) {
      case "weather": return "Weather API";
      case "platform_outage": return "Platform Status API";
      case "traffic": return "Traffic Maps API";
      case "aqi": return "AQI Sensor API";
      default: return "Disruption API";
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claims & Payouts</h1>
          <p className="text-gray-600">Automatic claim processing and payout details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAdmin(!showAdmin)} className="text-gray-600 border-gray-300">
            <Settings2 className="w-5 h-5 mr-1" /> Admin Panel
          </Button>
          {demoState === "idle" && (
            <Button onClick={runDemo} className="bg-orange-500 hover:bg-orange-600 shadow-md transform transition active:scale-95">
              <Activity className="w-5 h-5 mr-2" /> Simulate Disruption Event
            </Button>
          )}
          {(demoState === "done" || demoState === "fraud_failed") && (
            <Button onClick={() => setDemoState("idle")} variant="outline" className="border-orange-500 text-orange-600">
              Reset Demo
            </Button>
          )}
        </div>
      </div>

      {showAdmin && (
        <Card className="border-orange-300 bg-orange-50/50 shadow-sm animate-in fade-in slide-in-from-top-4">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-orange-900 flex items-center gap-2 text-lg">
              <Settings2 className="w-5 h-5" /> Demo Control Panel
              <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-300 ml-2">Hackathon Presenter View</Badge>
            </CardTitle>

            {/* FRAUD TOGGLE */}
            <Button
              size="sm"
              onClick={() => setSimulateFraud(!simulateFraud)}
              variant={simulateFraud ? "destructive" : "outline"}
              className={simulateFraud ? "shadow-sm animate-pulse" : "border-orange-300 text-orange-700 bg-white"}
            >
              <ShieldCheck className="w-4 h-4 mr-1" />
              {simulateFraud ? "Fraud Simulation Active" : "Test Anti-Fraud Engine"}
            </Button>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
          
            {/* AI TRAINING PANEL */}
            <div className="md:col-span-2 bg-indigo-50/50 border border-indigo-200 p-5 rounded-xl mt-2 mb-2 shadow-sm animate-in fade-in zoom-in-95">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Label className="text-indigo-900 font-bold text-xl flex items-center gap-2">
                     <BrainCircuit className="w-6 h-6 text-indigo-600" />
                     TensorFlow Neural Engine
                     {isModelReady() && <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-sm ml-2">Trained & Active</Badge>}
                  </Label>
                  <p className="text-sm text-indigo-700 mt-1 font-medium max-w-xl">Train a local Machine Learning model on 3,000 synthetic historical claims to predict precise counterfactual payouts based on historical severity maps.</p>
                </div>
                <Button 
                   onClick={handleTrainModel} 
                   disabled={isTrainingMl || isModelReady()}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[180px] shadow-md transition-all h-12"
                >
                  {isTrainingMl ? `Training... Epoch ${trainingProgress.epoch}` : isModelReady() ? "Model Online - Predicting" : "Initialize & Train AI Model"}
                </Button>
              </div>
              
              {isTrainingMl && (
                <div className="mt-5 space-y-2">
                   <div className="flex justify-between text-xs font-bold text-indigo-800 tracking-wider uppercase">
                     <span>Epoch {trainingProgress.epoch} of 50</span>
                     <span>Mean Squared Error: {trainingProgress.loss.toFixed(6)}</span>
                   </div>
                   <Progress value={(trainingProgress.epoch / 50) * 100} className="h-2.5 bg-indigo-200 border border-indigo-300 [&>div]:bg-indigo-600" />
                </div>
              )}
            </div>

            {/* INJECT INTERACTIVE SPOOF TARGET SELECTOR HERE IF ACTIVE! */}
            {simulateFraud && (
              <div className="md:col-span-2 bg-red-100/50 border-2 border-dashed border-red-300 p-6 rounded-xl animate-in fade-in slide-in-from-top-2 mb-2">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <Label className="text-red-900 font-bold text-lg">Spoofed GPS Target Selection</Label>
                </div>
                <div className="grid md:grid-cols-2 gap-4 items-center">
                  <Select value={spoofedCity} onValueChange={setSpoofedCity}>
                    <SelectTrigger className="w-full border-red-300 bg-white text-red-900 h-12 shadow-sm">
                      <SelectValue placeholder="Select Spoofed City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Delhi">Delhi, India (1,148 km away)</SelectItem>
                      <SelectItem value="Bangalore">Bangalore, India (845 km away)</SelectItem>
                      <SelectItem value="London">London, UK (7,190 km away)</SelectItem>
                      <SelectItem value="New_York">New York, USA (12,530 km away)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-red-800 font-medium leading-relaxed bg-white/50 p-3 rounded-lg border border-red-200">
                    The simulation will force the device GPS to transmit from <strong className="uppercase">{spoofLocations[spoofedCity as keyof typeof spoofLocations].name}</strong>, while the Network IP securely traces back to the normal zone.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-orange-900 font-semibold text-base">Disruption Type</Label>
              </div>
              <Select value={disruptionType} onValueChange={setDisruptionType}>
                <SelectTrigger className="w-full border-orange-300 bg-white shadow-sm h-12">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weather">Extreme Weather Event</SelectItem>
                  <SelectItem value="platform_outage">Delivery App Outage / Server Down</SelectItem>
                  <SelectItem value="traffic">Traffic Gridlock / Road Closure</SelectItem>
                  <SelectItem value="aqi">Hazardous Air Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-orange-900 font-semibold text-base">Severity Score</Label>
                <div className="flex items-center gap-3">
                  {disruptionType === "weather" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleFetchLiveWeather}
                      disabled={isFetchingWeather}
                      className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${isFetchingWeather ? 'animate-spin' : ''}`} />
                      Live API
                    </Button>
                  )}
                  <span className="font-bold text-lg text-orange-600 w-10 text-right">{severity[0]}%</span>
                </div>
              </div>
              <Slider
                value={severity}
                onValueChange={setSeverity}
                max={100}
                step={1}
                className="py-6 cursor-pointer"
              />
            </div>

            <div className="space-y-4 md:col-span-2 pt-2 border-t border-orange-200">
              <div className="flex justify-between items-center">
                <Label className="text-orange-900 font-semibold text-base">Current Delivery Demand Left</Label>
                <span className="font-bold text-lg text-orange-600">{demandLevel[0]}%</span>
              </div>
              <Slider
                value={demandLevel}
                onValueChange={setDemandLevel}
                max={100}
                step={1}
                className="py-4 cursor-pointer"
              />
              <p className="text-xs text-orange-700">Lower capacity = Higher counterfactual payout</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LOADING STATES */}
      {demoState !== "idle" && demoState !== "done" && demoState !== "fraud_failed" && (
        <Card className="border-blue-300 bg-blue-50 shadow-md mt-6 animate-pulse">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-3 text-lg">
              {demoState === "simulating" && <>{getDisruptionIcon(disruptionType, "animate-bounce w-8 h-8 text-blue-500")} API Polling: Fetching active {disruptionType} + demand metrics for {user.location}...</>}

              {demoState === "fraud_check" && <><ShieldCheck className="animate-spin w-8 h-8 text-indigo-500" /> Fraud Check: Cross-referencing device GPS with Network IP...</>}

              {demoState === "calculating" && <><TrendingUp className="animate-bounce w-8 h-8 text-green-500" /> Evaluator: {fraudResult?.distance}km distance verified. Running risk algorithm for payout...</>}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* FRAUD FAILED UI */}
      {demoState === "fraud_failed" && fraudResult && (
        <Card className="border-red-500 bg-red-50 shadow-lg mt-6 animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-red-900 flex items-center gap-3 text-2xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              Claim Rejected: Fraud Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-red-800 text-lg">
              Anti-Spoofing engine detected a massive variance between the device's GPS tag and the Network IP origin.
            </p>
            <div className="bg-white p-5 rounded-lg border-2 border-red-200 shadow-sm relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <ShieldCheck className="w-64 h-64 text-red-900" />
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">GPS Location Tag</p>
                  <p className="font-bold text-gray-900 text-lg flex items-center gap-2 mt-1">
                    {fraudResult.spoofedDetails.name} <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-sm uppercase tracking-widest text-[10px]">Spoofed</Badge>
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-1">LAT: {fraudResult.spoofedDetails.lat.toFixed(4)} / LON: {fraudResult.spoofedDetails.lon.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Network IP Origin</p>
                  <p className="font-bold text-gray-900 text-lg mt-1">Chennai, India</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">LAT: 19.0760 / LON: 72.8777</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-red-100 flex items-center justify-between relative z-10">
                <p className="text-gray-700 font-medium">Calculated Variance Distance:</p>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-red-600 bg-red-100 px-3 py-1 rounded-md">{fraudResult.distance.toLocaleString()} km</p>
                  <p className="text-[10px] text-red-500 mt-1 font-bold tracking-widest">MAX ALLOWED: 50.0 km</p>
                </div>
              </div>
            </div>
            <div className="flex p-4 bg-red-900 text-red-50 rounded-lg items-center text-sm font-medium tracking-wide shadow-inner">
              <ShieldCheck className="w-5 h-5 mr-3 text-red-300" />
              ACTION: POLICY SUSPENDED PENDING MANUAL REVIEW. PAYOUT BLOCKED.
            </div>
          </CardContent>
        </Card>
      )}

      {/* SUCCESS UI */}
      {demoState === "done" && claimResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 mt-6">
          {/* COUNTERFACTUAL - HACKATHON FOCUS */}
          <div style={{
            border: '3px solid #1E40AF',
            padding: '28px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3B82F6 100%)',
            color: 'white',
            boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.5)'
          }}>
            <h2 className="flex items-center" style={{ margin: '0 0 20px 0', fontSize: '24px' }}>
              🧠 Counterfactual Evaluation
              <span className="flex items-center ml-3 bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                <Activity className="w-3 h-3 mr-1" /> DYNAMIC AI RESULT
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 flex flex-col justify-center">
                <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wide">Normal Income</p>
                <div className="text-3xl font-bold text-gray-200 drop-shadow-sm">
                  ₹{claimResult.expectedIncomeWithoutDisruption}
                </div>
                <p className="text-xs text-blue-200 mt-2">Without Disruption <br />(for {claimResult.hoursLost} hours)</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 flex flex-col justify-center">
                <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wide">Actual Income</p>
                <div className="text-3xl font-extrabold text-[#fecaca] drop-shadow-sm">
                  ₹{claimResult.actualIncomeWithDisruption}
                </div>
                <p className="text-xs text-blue-200 mt-2">During Disruption <br />(only {demandLevel[0]}% demand)</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Wallet className="w-24 h-24" />
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wide">Approved Payout</p>
                <div className="text-4xl font-extrabold text-[#a7f3d0] drop-shadow-sm">
                  ₹{claimResult.payout}
                </div>
                <p className="text-xs text-green-200 mt-2">Instantly Credited</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-black/20 rounded-lg border-l-4 border-blue-300">
              <p className="text-[15px] leading-relaxed text-blue-50 font-medium tracking-wide">
                {claimResult.explanation} <br /><br />
                <span className="text-green-300 flex items-center text-sm font-bold">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Fraud Check: Passed ({Math.round(fraudResult?.distance || 0)}km IP variance)
                </span>
              </p>
            </div>
          </div>

          {/* Active Claim */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center shadow-inner">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  Claim Approved
                </CardTitle>
                <Badge className="bg-green-600 hover:bg-green-700 text-white text-md px-4 py-1.5 shadow-sm">Completed ✓</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-green-100 shadow-sm transition hover:shadow-md">
                  <p className="text-sm text-gray-500 mb-1 font-medium">Disruption Trigger</p>
                  <div className="flex items-center gap-2">
                    {getDisruptionIcon(claimResult.disruptionType, "w-5 h-5 text-blue-500")}
                    <p className="font-bold text-gray-900">{getDisruptionName(claimResult.disruptionType)}</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-100 shadow-sm transition hover:shadow-md">
                  <p className="text-sm text-gray-500 mb-1 font-medium">Platform Demand</p>
                  <p className="text-2xl font-bold text-gray-900">Only {demandLevel[0]}% left</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-100 shadow-sm transition hover:shadow-md">
                  <p className="text-sm text-gray-500 mb-1 font-medium">Auto-Payout</p>
                  <p className="text-2xl font-bold text-green-600">₹{claimResult.payout}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 shadow-sm h-11">
                      <Wallet className="w-4 h-4 mr-2" />
                      View Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between text-xl w-full pr-6">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-green-600" /> Wallet History
                        </div>
                        <Button variant="ghost" size="sm" onClick={clearHistory} className="h-8 px-2 text-gray-400 hover:text-red-600 hover:bg-red-50">
                          Clear demo
                        </Button>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex justify-between items-center text-green-900">
                        <span className="font-medium">Total Lifetime Payouts</span>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{claimHistory.reduce((sum, claim) => sum + claim.payout, 0)}
                        </span>
                      </div>

                      <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide flex items-center gap-2 mt-4 mb-2">
                        <History className="w-4 h-4" /> Recent Claims
                      </h4>
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {claimHistory.length === 0 ? (
                          <p className="text-gray-500 text-center py-4 text-sm">No payouts yet.</p>
                        ) : (
                          [...claimHistory].reverse().map((claim, idx) => (
                            <div key={idx} className="bg-white border p-3 rounded-lg shadow-sm flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2">
                                  {getDisruptionIcon(claim.disruptionType, "w-4 h-4 text-gray-500")}
                                  <p className="font-semibold text-gray-900 capitalize">{(claim.disruptionType || 'weather').replace('_', ' ')}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{new Date(claim.date).toLocaleDateString()} • {claim.hoursLost}hrs Impact</p>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <p className="font-bold text-green-600">+ ₹{claim.payout}</p>
                                <Badge variant="outline" className="text-[10px] mt-1 bg-green-50 text-green-700 border-green-200 py-0 px-2 h-5">Auto-Approved</Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => toast.info("Receipt downloaded: INVG-CLAIM-" + Math.floor(Math.random() * 10000) + ".pdf")}
                  variant="outline"
                  className="flex-1 border-green-200 text-green-700 hover:bg-green-50 h-11"
                >
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
