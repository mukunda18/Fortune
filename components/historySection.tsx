import { gameState } from "@/gameInterfaces/gameState";

interface HistorySectionProps {
  gameState: gameState;
}

export function HistorySection({ gameState }: HistorySectionProps) {
  if (gameState.gameHistory.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>
        <span>📜</span> Game History ({gameState.gameHistory.length})
      </h2>
      <div>
        {gameState.gameHistory
          .slice()
          .reverse()
          .map((entry, index) => (
            <div
              key={index}
            >
              {JSON.stringify(entry)}
            </div>
          ))}
      </div>
    </div>
  );
}
