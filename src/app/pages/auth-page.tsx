import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Sparkles } from "lucide-react";
import { mockApi } from "../../services/mockApi";

export function AuthPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    platform: "",
    location: "",
    vehicle: "bike",
    dailyIncome: 500,
    persona: "hustler",
  });
  const [calculatedPremium, setCalculatedPremium] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const premium = mockApi.calculatePremium({
      dailyIncome: formData.dailyIncome,
      vehicle: formData.vehicle,
      zone: formData.location,
      persona: formData.persona,
    });
    setCalculatedPremium(premium);
  };

  const confirmAndProceed = () => {
    localStorage.setItem("user", JSON.stringify({ ...formData, premiumPaid: calculatedPremium }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md my-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-10 h-10 text-blue-600" />
          <span className="text-3xl font-bold text-blue-900">InsureGig AI</span>
        </div>

        {calculatedPremium === null ? (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Create your account to protect your delivery income
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyIncome">Average Daily Income (₹)</Label>
                  <Input
                    id="dailyIncome"
                    type="number"
                    value={formData.dailyIncome}
                    onChange={(e) => setFormData({ ...formData, dailyIncome: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Primary Vehicle</Label>
                  <Select
                    value={formData.vehicle}
                    onValueChange={(value) => setFormData({ ...formData, vehicle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">Motorbike</SelectItem>
                      <SelectItem value="cycle">Bicycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Delivery Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="swiggy">Swiggy</SelectItem>
                      <SelectItem value="zomato">Zomato</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Primary Delivery Zone (City)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai, Bangalore"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Worker Risk Persona</Label>
                  <Select
                    value={formData.persona}
                    onValueChange={(value) => setFormData({ ...formData, persona: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select persona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hustler">The Hustler (Peak/Traffic)</SelectItem>
                      <SelectItem value="night_owl">The Night Owl (Late/Low Vis)</SelectItem>
                      <SelectItem value="fair_weather">The Fair-Weather Rider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Sparkles className="w-4 h-4 mr-2" /> Calculate Dynamic Premium
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-center text-green-800">Your Dynamic AI Premium</CardTitle>
              <CardDescription className="text-center text-green-600">
                Calculated based on your income, zone, vehicle, and persona.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-6 rounded-lg text-center shadow-sm border border-green-100">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Weekly Premium</span>
                <div className="text-5xl font-extrabold text-green-600 mt-2">
                  ₹{calculatedPremium}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Covers up to ₹{calculatedPremium * 8} per claim for weather & demand disruptions.
                </p>
              </div>

              <Button onClick={confirmAndProceed} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-medium">
                Subscribe & Go to Dashboard
              </Button>
              <Button onClick={() => setCalculatedPremium(null)} variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-100 bg-white">
                Recalculate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
