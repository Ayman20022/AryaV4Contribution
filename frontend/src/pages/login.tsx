import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/authService";
import { useUserStore } from "@/store";
import { toast } from "sonner";
import LoadingIcon from "@/components/ui/loading-icon";
import { UserService } from "@/services/userService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("alice.johnson@example.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");

    try {
      const result = await AuthService.login(email, password);
      const { accessToken } = result.data;

      localStorage.setItem("authToken", accessToken);

      const { data: user } = await UserService.getMe();
      setUser(user);

      if (user.preferences == null) {
        navigate("/select-interests", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      toast.success(`Welcome ${user.firstName} ${user.lastName}`);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setEmailError(data.email);
          setPasswordError(data.password);
        } else if (status === 422) {
          setPasswordError(data.message);
          setEmailError("");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] to-[#161e33] backdrop-blur-sm text-white">
      <AuthNavbar />
      <main className="pt-20 pb-20 md:pb-6 animate-fade-in flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md px-4">
          <div className="bg-card/70 backdrop-blur-sm border border-border/30 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">
              Login to Sphere
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input/50 border-border/50 focus:border-primary"
                  autoComplete="email"
                />
                <div className="text-red-400 text-sm">{emailError}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input/50 border-border/50 focus:border-primary"
                  autoComplete="current-password"
                />
                <div className="text-red-400 text-sm">{passwordError}</div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <LoadingIcon size={1.4} />}
                Login
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
