import { gameState } from "@/gameInterfaces/gameState";

interface PlayerCardProps {
  player: gameState['players'][string];
  isCurrentPlayer: boolean;
}

export function PlayerCard({ player, isCurrentPlayer }: PlayerCardProps) {
  return (
    <div>
      <div>
        <div>
          <span>{isCurrentPlayer ? '🎯' : '👤'}</span>
          <h3>
            {player.name}
          </h3>
        </div>
        {player.bankrupted && (
          <span>
            Bankrupt
          </span>
        )}
      </div>

      <div>
        <div>
          <p>Color</p>
          <p>{player.color}</p>
        </div>
        <div>
          <p>Money</p>
          <p>${player.money}</p>
        </div>
        <div>
          <p>Position</p>
          <p>{player.position}</p>
        </div>
        <div>
          <p>Status</p>
          <p>
            {player.inJail ? '🔒 Jail' : '🚶 Free'}
          </p>
        </div>
      </div>

      {player.properties.length > 0 && (
        <div>
          <p>Properties</p>
          <div>
            {player.properties.map((prop) => (
              <span
                key={prop}
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}

      {player.disconnected && (
        <div>
          ⚠️ Disconnected
        </div>
      )}
    </div>
  );
}
