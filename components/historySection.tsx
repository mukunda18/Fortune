import { GameState } from "@/gameInterfaces/gameState";

interface HistorySectionProps {
  gameState: GameState;
}

export function HistorySection({ gameState }: HistorySectionProps) {
  if (gameState.gameHistory.length === 0) return null;

  return (
    <section>
      <h3>📜 History ({gameState.gameHistory.length})</h3>
      <ul>
        {gameState.gameHistory
          .slice()
          .reverse()
          .map((entry, index) => (
            <li key={index}>
              <strong>{entry.player}:</strong> {entry.message}
            </li>
          ))}
      </ul>
    </section>
  );
}
