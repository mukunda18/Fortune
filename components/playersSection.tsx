import { PlayerCard } from "./playerCard";
import { GameState } from "@/gameInterfaces/gameState";

interface PlayersSectionProps {
  gameState: GameState;
  playerName?: string;
}

export function PlayersSection({ gameState, playerName }: PlayersSectionProps) {
  const players = Object.values(gameState.players);

  return (
    <section>
      <h3>👥 Players ({players.length})</h3>
      <div>
        {players.length === 0 ? (
          <p>No players in room</p>
        ) : (
          players.map((p) => (
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
    </section>
  );
}
