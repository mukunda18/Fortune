import { gameState } from "@/gameInterfaces/gameState";

interface PlayerCardProps {
  player: gameState['players'][string];
  isCurrentPlayer: boolean;
}

export function PlayerCard({ player, isCurrentPlayer }: PlayerCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        isCurrentPlayer
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 shadow-lg'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isCurrentPlayer ? '🎯' : '👤'}</span>
          <h3 className="font-bold text-slate-900 dark:text-white truncate">
            {player.name}
          </h3>
        </div>
        {player.bankrupted && (
          <span className="px-2 py-1 bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-semibold rounded">
            Bankrupt
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Color</p>
          <p className="font-semibold text-slate-900 dark:text-white">{player.color}</p>
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Money</p>
          <p className="font-semibold text-slate-900 dark:text-white">${player.money}</p>
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Position</p>
          <p className="font-semibold text-slate-900 dark:text-white">{player.position}</p>
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Status</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {player.inJail ? '🔒 Jail' : '🚶 Free'}
          </p>
        </div>
      </div>

      {player.properties.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-xs mb-2">Properties</p>
          <div className="flex flex-wrap gap-1">
            {player.properties.map((prop) => (
              <span
                key={prop}
                className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs rounded font-medium"
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}

      {player.disconnected && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-red-600 dark:text-red-400">
          ⚠️ Disconnected
        </div>
      )}
    </div>
  );
}
