'use client';

import { useAtom } from "jotai";
import { gameStateAtom } from "@/stores/gameStore";
import { playerNameAtom } from "@/stores/roomStore";
import { GameStatsRow } from "./gameStatsRow";
import { PlayersSection } from "./playersSection";
import { SettingsSidebar } from "./settingsSidebar";
import { PropertiesSection } from "./propertiesSection";
import { HistorySection } from "./historySection";
import { DebugInfo } from "./debugInfo";

export default function GameStateViewer() {
  const [gameState] = useAtom(gameStateAtom);
  const [playerName] = useAtom(playerNameAtom);

  if (!gameState) {
    return (
      <div>
        <div>
          <div>🎲</div>
          <p>Loading game state...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <GameStatsRow gameState={gameState} />

      <div>
        <div>
          <PlayersSection gameState={gameState} playerName={playerName} />
        </div>
        <SettingsSidebar gameState={gameState} />
      </div>

      <PropertiesSection gameState={gameState} />

      <HistorySection gameState={gameState} />

      {gameState.gameHistory.length === 0 && Object.keys(gameState.properties).length === 0 && (
        <div>
          <p>🎮 Game not started yet</p>
          <p>Waiting for game to begin...</p>
        </div>
      )}

      <DebugInfo gameState={gameState} />
    </div>
  );
}