import { useState } from "react";
import { RotateCcw, Coins } from "lucide-react";

interface CasinoGamesProps {
  balance: number;
  onTransaction: (amount: number, type: "casino-win" | "casino-loss", description: string) => void;
}

const WHEEL_SEGMENTS = [
  { label: "10", value: 10, color: "bg-blue-500" },
  { label: "50", value: 50, color: "bg-emerald-500" },
  { label: "0", value: 0, color: "bg-red-500" },
  { label: "100", value: 100, color: "bg-purple-500" },
  { label: "25", value: 25, color: "bg-amber-500" },
  { label: "200", value: 200, color: "bg-pink-500" },
  { label: "0", value: 0, color: "bg-red-500" },
  { label: "500", value: 500, color: "bg-gold" },
];

const CasinoGames = ({ balance, onTransaction }: CasinoGamesProps) => {
  return (
    <div className="space-y-4 px-3 pt-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground uppercase">🎰 Mini Casino Games</h2>
        <span className="text-xs text-gold font-bold flex items-center gap-1"><Coins size={14} /> {balance}</span>
      </div>
      <SpinWheel balance={balance} onTransaction={onTransaction} />
      <DiceGame balance={balance} onTransaction={onTransaction} />
      <CardFlip balance={balance} onTransaction={onTransaction} />
    </div>
  );
};

function SpinWheel({ balance, onTransaction }: CasinoGamesProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const cost = 20;

  const spin = () => {
    if (spinning || balance < cost) return;
    onTransaction(-cost, "casino-loss", `Spin Wheel entry: -${cost} coins`);
    setSpinning(true);
    setResult(null);
    const winIdx = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const newRotation = rotation + 1440 + (winIdx * (360 / WHEEL_SEGMENTS.length));
    setRotation(newRotation);
    setTimeout(() => {
      const prize = WHEEL_SEGMENTS[winIdx].value;
      setResult(prize);
      setSpinning(false);
      if (prize > 0) onTransaction(prize, "casino-win", `Spin Wheel won: +${prize} coins`);
    }, 3000);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <h3 className="text-xs font-bold text-foreground mb-3">🎡 Spin Wheel <span className="text-muted-foreground font-normal">(Cost: {cost} coins)</span></h3>
      <div className="relative w-48 h-48 mx-auto mb-3">
        <div
          className="w-full h-full rounded-full border-4 border-primary overflow-hidden transition-transform ease-out"
          style={{ transform: `rotate(${rotation}deg)`, transitionDuration: spinning ? "3s" : "0s" }}
        >
          {WHEEL_SEGMENTS.map((seg, i) => (
            <div
              key={i}
              className={`absolute w-1/2 h-1/2 origin-bottom-right ${seg.color} flex items-center justify-center`}
              style={{ transform: `rotate(${i * 45}deg) skewY(-45deg)`, top: 0, left: 0 }}
            >
              <span className="text-[10px] font-bold text-white transform skewY(45deg) rotate-[-22deg]">{seg.label}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-primary z-10" />
      </div>
      {result !== null && (
        <p className={`text-center text-sm font-bold mb-2 ${result > 0 ? "text-success" : "text-destructive"}`}>
          {result > 0 ? `🎉 Won ${result} coins!` : "😔 No prize!"}
        </p>
      )}
      <button onClick={spin} disabled={spinning || balance < cost}
        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
        <RotateCcw size={14} className={spinning ? "animate-spin" : ""} />
        {spinning ? "Spinning..." : "Spin!"}
      </button>
    </div>
  );
}

function DiceGame({ balance, onTransaction }: CasinoGamesProps) {
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState<number | null>(null);
  const [guess, setGuess] = useState(3);
  const [result, setResult] = useState<string | null>(null);
  const cost = 30;
  const diceEmoji = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  const roll = () => {
    if (rolling || balance < cost) return;
    onTransaction(-cost, "casino-loss", `Dice Game entry: -${cost} coins`);
    setRolling(true);
    setResult(null);
    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setDice(val);
      setRolling(false);
      if (val === guess) {
        const prize = cost * 5;
        onTransaction(prize, "casino-win", `Dice Game won: guessed ${guess}, got ${val} (+${prize} coins)`);
        setResult(`🎉 Correct! Won ${prize} coins!`);
      } else {
        setResult(`Dice: ${val}. You guessed ${guess}. Try again!`);
      }
    }, 1500);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <h3 className="text-xs font-bold text-foreground mb-3">🎲 Dice Game <span className="text-muted-foreground font-normal">(Cost: {cost} coins, 5x payout)</span></h3>
      <div className="text-center mb-3">
        <span className={`text-5xl ${rolling ? "animate-bounce" : ""}`}>{dice ? diceEmoji[dice - 1] : "🎲"}</span>
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">Your guess:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} onClick={() => setGuess(n)}
              className={`w-8 h-8 rounded text-xs font-bold ${guess === n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>
      {result && <p className={`text-xs font-bold text-center mb-2 ${result.includes("Correct") ? "text-success" : "text-muted-foreground"}`}>{result}</p>}
      <button onClick={roll} disabled={rolling || balance < cost}
        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
        {rolling ? "Rolling..." : "Roll Dice!"}
      </button>
    </div>
  );
}

function CardFlip({ balance, onTransaction }: CasinoGamesProps) {
  const [flipped, setFlipped] = useState(false);
  const [card, setCard] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [guess, setGuess] = useState<"red" | "black">("red");
  const cost = 25;

  const redCards = ["♥️ A", "♥️ K", "♥️ Q", "♦️ A", "♦️ K", "♦️ Q", "♥️ J", "♦️ J", "♥️ 10", "♦️ 10"];
  const blackCards = ["♠️ A", "♠️ K", "♠️ Q", "♣️ A", "♣️ K", "♣️ Q", "♠️ J", "♣️ J", "♠️ 10", "♣️ 10"];
  const allCards = [...redCards, ...blackCards];

  const flip = () => {
    if (flipped || balance < cost) return;
    onTransaction(-cost, "casino-loss", `Card Flip entry: -${cost} coins`);
    setFlipped(true);
    setResult(null);
    setTimeout(() => {
      const picked = allCards[Math.floor(Math.random() * allCards.length)];
      setCard(picked);
      const isRed = redCards.includes(picked);
      const won = (guess === "red" && isRed) || (guess === "black" && !isRed);
      if (won) {
        const prize = cost * 2;
        onTransaction(prize, "casino-win", `Card Flip won: ${picked} (+${prize} coins)`);
        setResult(`🎉 ${picked} - You won ${prize} coins!`);
      } else {
        setResult(`${picked} - Wrong guess!`);
      }
      setFlipped(false);
    }, 1000);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <h3 className="text-xs font-bold text-foreground mb-3">🃏 Card Flip <span className="text-muted-foreground font-normal">(Cost: {cost} coins, 2x payout)</span></h3>
      <div className="text-center mb-3">
        <div className={`inline-block w-20 h-28 rounded-lg border-2 border-primary flex items-center justify-center text-2xl font-bold ${flipped ? "animate-pulse bg-primary/20" : "bg-surface"}`}>
          {flipped ? "?" : card || "🂠"}
        </div>
      </div>
      <div className="flex gap-2 justify-center mb-3">
        <button onClick={() => setGuess("red")}
          className={`px-4 py-2 rounded text-xs font-bold ${guess === "red" ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"}`}>
          ♥️ Red
        </button>
        <button onClick={() => setGuess("black")}
          className={`px-4 py-2 rounded text-xs font-bold ${guess === "black" ? "bg-gray-800 text-white border border-white/20" : "bg-muted text-muted-foreground"}`}>
          ♠️ Black
        </button>
      </div>
      {result && <p className={`text-xs font-bold text-center mb-2 ${result.includes("won") ? "text-success" : "text-destructive"}`}>{result}</p>}
      <button onClick={flip} disabled={flipped || balance < cost}
        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
        {flipped ? "Flipping..." : "Flip Card!"}
      </button>
    </div>
  );
}

export default CasinoGames;
