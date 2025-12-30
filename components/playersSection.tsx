import { PlayerCard } from "./playerCard";
import { gameState } from "@/gameInterfaces/gameState";

interface PlayersSectionProps {
  gameState: gameState;
}

export function PlayersSection({ gameState }: PlayersSectionProps) {
  return (
    <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span>👥</span> Players ({Object.keys(gameState.players).length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {Object.values(gameState.players).length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400 col-span-2 text-center py-8">
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
