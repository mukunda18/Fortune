import { gameState } from "@/gameInterfaces/gameState";

interface DebugInfoProps {
  gameState: gameState;
}

export function DebugInfo({ gameState }: DebugInfoProps) {
  return (
    <details>
      <summary>
        📋 Debug Info (Version: {gameState.version})
      </summary>
      <pre>
        {JSON.stringify(gameState, null, 2)}
      </pre>
    </details>
  );
}
