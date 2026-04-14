import { useState } from "react";
import { ArrowLeft, Check, Globe } from "lucide-react";

interface LanguagePageProps {
  onBack: () => void;
}

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

const LanguagePage = ({ onBack }: LanguagePageProps) => {
  const [selected, setSelected] = useState("en");

  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-3 py-3 bg-surface border-b border-border">
        <button onClick={onBack}><ArrowLeft size={18} className="text-foreground" /></button>
        <Globe size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">Language</h2>
      </div>

      <div className="px-3 mt-3 space-y-1">
        {languages.map((lang) => (
          <button key={lang.code} onClick={() => setSelected(lang.code)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
              selected === lang.code ? "bg-primary/10 border-primary/40" : "bg-surface border-border hover:border-primary/30"
            }`}>
            <div>
              <p className="text-sm font-medium text-foreground">{lang.label}</p>
              <p className="text-xs text-muted-foreground">{lang.native}</p>
            </div>
            {selected === lang.code && <Check size={18} className="text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguagePage;
