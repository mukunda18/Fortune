'use client';

import { useAtom } from "jotai";
import { gameStateAtom } from "@/stores/gameStore";
import { gameState } from "@/gameInterfaces/gameState";
import { property, upgradableProperty, buyableProperty, effectProperty } from "@/gameInterfaces/property";

export default function GameStateViewer() {
  const [gameState] = useAtom(gameStateAtom);

  if (!gameState) return <p>Not in a game.</p>;

  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <GameSettings settings={gameState.settings} />
      <PlayersList players={gameState.players} currentPlayer={gameState.currentPlayer} />
      <PropertiesList properties={gameState.properties} />
      <Dice dice={gameState.dice} rollRepeat={gameState.rollRepeat} />
      <GameHistory history={gameState.gameHistory} />
    </div>
  );
}

function GameSettings({ settings }: { settings: gameState["settings"] }) {
  return (
    <div>
      <h2>Game Settings</h2>
      <ul>
        {Object.entries(settings).map(([key, value]) => (
          <li key={key}>
            {key}: {value.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlayersList({ players, currentPlayer }: { players: gameState["players"]; currentPlayer: string }) {
  return (
    <div>
      <h2>Players</h2>
      <ul>
        {Object.values(players).map((p) => (
          <li key={p.name}>
            <strong>{p.name}</strong> {currentPlayer === p.name ? "(Current Turn)" : ""}
            <ul>
              <li>Color: {p.color}</li>
              <li>Money: ${p.money}</li>
              <li>Position: {p.position}</li>
              <li>In Jail: {p.inJail ? "Yes" : "No"}</li>
              <li>Bankrupted: {p.bankrupted ? "Yes" : "No"}</li>
              <li>Properties: {p.properties.join(", ") || "None"}</li>
              <li>Cards: {p.cards.join(", ") || "None"}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PropertiesList({
  properties,
}: {
  properties: Record<string, property | upgradableProperty | buyableProperty | effectProperty>;
}) {
  return (
    <div>
      <h2>Properties</h2>
      <ul>
        {Object.entries(properties).map(([propId, prop]) => (
          <li key={propId}>
            <strong>{prop.name}</strong> (Group: {prop.group})
            <ul>
              {"owner" in prop && <li>Owner: {prop.owner || "None"}</li>}
              {"price" in prop && <li>Price: ${prop.price}</li>}
              {"mortgaged" in prop && <li>Mortgaged: {prop.mortgaged ? "Yes" : "No"}</li>}
              {"upgradeCost" in prop && <li>Upgrade Cost: ${prop.upgradeCost}</li>}
              {"rent" in prop && <li>Rent: {prop.rent.join(", ")}</li>}
              {"level" in prop && <li>Level: {prop.level}</li>}
              {"effect" in prop && <li>Effect: {prop.effect}</li>}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dice({ dice, rollRepeat }: { dice: gameState["dice"]; rollRepeat: number }) {
  return (
    <div>
      <h2>Dice</h2>
      <p>
        🎲 {dice[0]} + {dice[1]} (Repeat: {rollRepeat})
      </p>
    </div>
  );
}

function GameHistory({ history }: { history: gameState["gameHistory"] }) {
  return (
    <div>
      <h2>Game History</h2>
      {history.length === 0 ? (
        <p>No actions yet.</p>
      ) : (
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{JSON.stringify(entry)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
