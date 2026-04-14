import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";

interface SignupPageProps {
  onBack: () => void;
  onLoginClick: () => void;
}

const SignupPage = ({ onBack, onLoginClick }: SignupPageProps) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = () => {
    if (!name || !mobile || !password || !confirmPass) { setError("Please fill all fields"); return; }
    if (password !== confirmPass) { setError("Passwords don't match"); return; }
    if (mobile.length < 10) { setError("Enter valid mobile number"); return; }
    setError("");
    setSuccess(true);
    setTimeout(() => onBack(), 1500);
  };

  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-3 py-3 bg-surface border-b border-border">
        <button onClick={onBack}><ArrowLeft size={18} className="text-foreground" /></button>
        <h2 className="text-sm font-bold text-foreground">Sign Up</h2>
      </div>

      <div className="px-6 mt-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            <span className="text-foreground">WIN</span><span className="text-gold">ADDA</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Create your demo account</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Mobile Number</label>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Password</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary pr-10" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Confirm Password</label>
            <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && <p className="text-xs text-success">Account created! Redirecting...</p>}

          <button onClick={handleSignup}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <UserPlus size={16} /> Create Account
          </button>

          <div className="text-center">
            <button onClick={onLoginClick} className="text-xs text-primary hover:underline">
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
