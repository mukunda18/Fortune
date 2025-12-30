import { gameState } from "@/gameInterfaces/gameState";

interface DebugInfoProps {
  gameState: gameState;
}

export function DebugInfo({ gameState }: DebugInfoProps) {
  return (
    <details className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-xs">
      <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
        📋 Debug Info (Version: {gameState.version})
      </summary>
      <pre className="mt-3 p-3 bg-slate-900 text-slate-100 rounded overflow-x-auto">
        {JSON.stringify(gameState, null, 2)}
      </pre>
    </details>
  );
}
