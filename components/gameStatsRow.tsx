import { StatCard } from "./statCard";
import { gameState } from "@/gameInterfaces/gameState";

interface GameStatsRowProps {
  gameState: gameState;
}

export function GameStatsRow({ gameState }: GameStatsRowProps) {
  return (
    <div>
      <StatCard
        title="Current Player"
        value={gameState.currentPlayer || "Waiting..."}
        icon="👤"
        color="blue"
      />
      <StatCard
        title="Turn Phase"
        value={gameState.turnPhase}
        icon="🎯"
        color="purple"
      />
      <StatCard
        title="Dice Rolls"
        value={`${gameState.dice[0]} + ${gameState.dice[1]}`}
        icon="🎲"
        color="green"
      />
      <StatCard
        title="Roll Repeat"
        value={gameState.rollRepeat.toString()}
        icon="🔄"
        color="orange"
      />
    </div>
  );
}
