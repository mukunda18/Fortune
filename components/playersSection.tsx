import { PlayerCard } from "./playerCard";
import { gameState } from "@/gameInterfaces/gameState";

interface PlayersSectionProps {
  gameState: gameState;
  playerName?: string;
}

export function PlayersSection({ gameState, playerName }: PlayersSectionProps) {
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
              isAdmin={gameState.admin === p.name}
              isUser={playerName === p.name}
            />
          ))
        )}
      </div>
    </div>
  );
}
