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
      <main>
        <h3>🎲 Loading game state...</h3>
      </main>
    );
  }

  return (
    <main>
      <GameStatsRow gameState={gameState} />

      <section>
        <PlayersSection gameState={gameState} playerName={playerName} />
        <SettingsSidebar gameState={gameState} />
      </section>

      <PropertiesSection gameState={gameState} />
      <HistorySection gameState={gameState} />

      {gameState.gameHistory.length === 0 && Object.keys(gameState.properties).length === 0 && (
        <section>
          <p>🎮 Game not started yet. Waiting for players...</p>
        </section>
      )}

      <DebugInfo gameState={gameState} />
    </main>
  );
}