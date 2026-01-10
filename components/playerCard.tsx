import { Player } from "@/gameInterfaces/player";

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  isAdmin?: boolean;
  isUser?: boolean;
}

export function PlayerCard({ player, isCurrentPlayer, isAdmin, isUser }: PlayerCardProps) {
  return (
    <div style={{ border: isCurrentPlayer ? '2px solid blue' : '1px solid gray', padding: '10px' }}>
      <h4>
        {player.name} {isUser && "(You)"} {isAdmin && "👑"}
        {isCurrentPlayer && " 🎯"}
      </h4>
      <p>Money: ${player.money} | Position: {player.position}</p>
      <p>Status: {player.inJail ? "In Jail" : "Free"} {player.isBankrupt && "| BANKRUPT"}</p>
      {player.properties.length > 0 && (
        <p>Properties: {player.properties.join(", ")}</p>
      )}
      {player.isDisconnected && <p>⚠️ Offline</p>}
    </div>
  );
}
