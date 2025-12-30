import { PlayerCard } from "./playerCard";
import { gameState } from "@/gameInterfaces/gameState";

interface PlayersSectionProps {
  gameState: gameState;
}

export function PlayersSection({ gameState }: PlayersSectionProps) {
  return (
    <div>
      <h2>
        <span>👥</span> Players ({Object.keys(gameState.players).length})
      </h2>
      <div>
        {Object.values(gameState.players).length === 0 ? (
          <p>
            No players yet
          </p>
        ) : (
          Object.values(gameState.players).map((p) => (
            <PlayerCard
              key={p.name}
              player={p}
              isCurrentPlayer={gameState.currentPlayer === p.name}
            />
          ))
        )}
      </div>
    </div>
  );
}
