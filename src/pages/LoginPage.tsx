import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";

interface LoginPageProps {
  onBack: () => void;
  onSignupClick: () => void;
}

const LoginPage = ({ onBack, onSignupClick }: LoginPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = () => {
    if (!username || !password) { setError("Please fill all fields"); return; }
    // Demo login - accept anything
    setError("");
    setSuccess(true);
    setTimeout(() => onBack(), 1500);
  };

  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-3 py-3 bg-surface border-b border-border">
        <button onClick={onBack}><ArrowLeft size={18} className="text-foreground" /></button>
        <h2 className="text-sm font-bold text-foreground">Login</h2>
      </div>

      <div className="px-6 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            <span className="text-foreground">WIN</span><span className="text-gold">ADDA</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Demo Platform • Virtual Coins</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Username / Mobile</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or mobile"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Password</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary pr-10" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && <p className="text-xs text-success">Login successful! Redirecting...</p>}

          <button onClick={handleLogin}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <LogIn size={16} /> Login
          </button>

          <div className="text-center">
            <button onClick={onSignupClick} className="text-xs text-primary hover:underline">
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
