import { gameState } from "@/gameInterfaces/gameState";

interface SettingsSidebarProps {
  gameState: gameState;
}

export function SettingsSidebar({ gameState }: SettingsSidebarProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 h-fit">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span>⚙️</span> Settings
      </h2>
      <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
        {Object.entries(gameState.settings).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
          >
            <span className="text-slate-600 dark:text-slate-400 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {typeof value === 'boolean' ? (value ? '✅' : '❌') : value.toString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
