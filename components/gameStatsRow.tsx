import { StatCard } from "./statCard";
import { GameState } from "@/gameInterfaces/gameState";

interface GameStatsRowProps {
  gameState: GameState;
}

export function GameStatsRow({ gameState }: GameStatsRowProps) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <StatCard
        title="Player"
        value={gameState.currentPlayer || "..."}
        icon="👤"
        color="blue"
      />
      <StatCard
        title="Phase"
        value={gameState.turnPhase}
        icon="🎯"
        color="purple"
      />
      <StatCard
        title="Dice"
        value={`${gameState.dice[0]} + ${gameState.dice[1]}`}
        icon="🎲"
        color="green"
      />
      <StatCard
        title="Rolls"
        value={gameState.rollRepeat.toString()}
        icon="🔄"
        color="orange"
      />
    </div>
  );
}
