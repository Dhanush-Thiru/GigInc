import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import logoGig from "../../../assets/LogoGig.jpeg";
import { supabase } from "../../services/supabaseClient";

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
  const continueToPlans = async () => {
    const userData = {
      ...formData,
      premium_status: "pending",
      daily_income: formData.dailyIncome // match DB schema
    };
    
    if (supabase) {
      const { error } = await supabase.from('users').upsert({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        platform: userData.platform,
        location: userData.location,
        vehicle: userData.vehicle,
        daily_income: userData.dailyIncome,
        premium_status: "pending",
        plan_type: "none"
      }, { onConflict: 'email' });
      if (error) console.error("Supabase user insert error:", error);
    }
    
    localStorage.setItem("user", JSON.stringify({
      ...formData,
      premiumStatus: "pending",
    }));
    navigate("/dashboard/plans");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md my-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={logoGig} alt="InsureGig" className="h-28 md:h-32 w-auto object-contain" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Create or access your account, then choose a plan and complete payment to unlock the full app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                continueToPlans();
              }}
              className="space-y-4"
            >
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91XXXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  <Select value={formData.vehicle} onValueChange={(value) => setFormData({ ...formData, vehicle: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motorcycle">Motorbike</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                      <SelectItem value="electric_scooter">Electric Scooter</SelectItem>
                      <SelectItem value="cycle">Bicycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Delivery Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
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
                  <Label>Worker Activity Persona</Label>
                  <Select
                    value={formData.persona}
                    onValueChange={(value) => setFormData({ ...formData, persona: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select persona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hustler">The Hustler (Peak/Traffic)</SelectItem>
                      <SelectItem value="night_owl">The Night Owl (Late/AQI)</SelectItem>
                      <SelectItem value="fair_weather">The Fair-Weather Rider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={continueToPlans}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
