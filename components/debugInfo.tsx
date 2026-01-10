import { GameState } from "@/gameInterfaces/gameState";

interface DebugInfoProps {
  gameState: GameState;
}

export function DebugInfo({ gameState }: DebugInfoProps) {
  return (
    <details>
      <summary>📋 Debug Info (v{gameState.version})</summary>
      <pre style={{ fontSize: '12px', background: '#eee', padding: '10px' }}>
        {JSON.stringify(gameState, null, 2)}
      </pre>
    </details>
  );
}
