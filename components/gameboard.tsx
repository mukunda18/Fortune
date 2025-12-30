'use client';

import { useAtom } from "jotai";
import { gameStateAtom } from "@/stores/gameStore";
import { GameStatsRow } from "./gameStatsRow";
import { PlayersSection } from "./playersSection";
import { SettingsSidebar } from "./settingsSidebar";
import { PropertiesSection } from "./propertiesSection";
import { HistorySection } from "./historySection";
import { DebugInfo } from "./debugInfo";

export default function GameStateViewer() {
  const [gameState] = useAtom(gameStateAtom);

  if (!gameState) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🎲</div>
          <p className="text-slate-600 dark:text-slate-400">Loading game state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GameStatsRow gameState={gameState} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlayersSection gameState={gameState} />
        </div>
        <SettingsSidebar gameState={gameState} />
      </div>

      <PropertiesSection gameState={gameState} />

      <HistorySection gameState={gameState} />

      {gameState.gameHistory.length === 0 && Object.keys(gameState.properties).length === 0 && (
        <div className="text-center py-12 text-slate-600 dark:text-slate-400">
          <p className="text-lg">🎮 Game not started yet</p>
          <p className="text-sm mt-2">Waiting for game to begin...</p>
        </div>
      )}

      <DebugInfo gameState={gameState} />
    </div>
  );
}