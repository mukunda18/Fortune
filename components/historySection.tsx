import { gameState } from "@/gameInterfaces/gameState";

interface HistorySectionProps {
  gameState: gameState;
}

export function HistorySection({ gameState }: HistorySectionProps) {
  if (gameState.gameHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span>📜</span> Game History ({gameState.gameHistory.length})
      </h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {gameState.gameHistory
          .slice()
          .reverse()
          .map((entry, index) => (
            <div
              key={index}
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300"
            >
              {JSON.stringify(entry)}
            </div>
          ))}
      </div>
    </div>
  );
}
