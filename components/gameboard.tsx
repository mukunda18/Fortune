'use client';

import { useAtom } from "jotai";
import { gameStateAtom } from "@/stores/gameStore";
import { gameState } from "@/gameInterfaces/gameState";
import { property, upgradableProperty, buyableProperty, effectProperty } from "@/gameInterfaces/property";

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
      {/* Game Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Player"
          value={gameState.currentPlayer || "Waiting..."}
          icon="👤"
          color="blue"
        />
        <StatCard
          title="Turn Phase"
          value={gameState.turnPhase}
          icon="🎯"
          color="purple"
        />
        <StatCard
          title="Dice Rolls"
          value={`${gameState.dice[0]} + ${gameState.dice[1]}`}
          icon="🎲"
          color="green"
        />
        <StatCard
          title="Roll Repeat"
          value={gameState.rollRepeat.toString()}
          icon="🔄"
          color="orange"
        />
      </div>

      {/* Game Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players Section */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>👥</span> Players ({Object.keys(gameState.players).length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {Object.values(gameState.players).length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400 col-span-2 text-center py-8">
                  No players yet
                </p>
              ) : (
                Object.values(gameState.players).map((p) => (
                  <PlayerCard
                    key={p.name}
                    player={p}
                    isCurrentPlayer={gameState.currentPlayer === p.name}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Game Settings Sidebar */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 h-fit">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⚙️</span> Settings
          </h2>
          <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
            {Object.entries(gameState.settings).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                <span className="text-slate-600 dark:text-slate-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {typeof value === 'boolean' ? (value ? '✅' : '❌') : value.toString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Section */}
      {Object.keys(gameState.properties).length > 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🏢</span> Properties ({Object.keys(gameState.properties).length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {Object.entries(gameState.properties).map(([propId, prop]) => (
              <PropertyCard key={propId} property={prop} />
            ))}
          </div>
        </div>
      )}

      {/* Game History Section */}
      {gameState.gameHistory.length > 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📜</span> Game History ({gameState.gameHistory.length})
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {gameState.gameHistory.slice().reverse().map((entry, index) => (
              <div
                key={index}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300"
              >
                {JSON.stringify(entry)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {gameState.gameHistory.length === 0 && Object.keys(gameState.properties).length === 0 && (
        <div className="text-center py-12 text-slate-600 dark:text-slate-400">
          <p className="text-lg">🎮 Game not started yet</p>
          <p className="text-sm mt-2">Waiting for game to begin...</p>
        </div>
      )}

      {/* Debug Info */}
      <details className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-xs">
        <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
          📋 Debug Info (Version: {gameState.version})
        </summary>
        <pre className="mt-3 p-3 bg-slate-900 text-slate-100 rounded overflow-x-auto">
          {JSON.stringify(gameState, null, 2)}
        </pre>
      </details>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700',
    purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700',
    green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700',
    orange: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-4 border`}>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        <span className="mr-2">{icon}</span>
        {value}
      </p>
    </div>
  );
}

interface PlayerCardProps {
  player: gameState['players'][string];
  isCurrentPlayer: boolean;
}

function PlayerCard({ player, isCurrentPlayer }: PlayerCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        isCurrentPlayer
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 shadow-lg'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isCurrentPlayer ? '🎯' : '👤'}</span>
          <h3 className="font-bold text-slate-900 dark:text-white truncate">
            {player.name}
          </h3>
        </div>
        {player.bankrupted && (
          <span className="px-2 py-1 bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-semibold rounded">
            Bankrupt
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Color</p>
          <p className="font-semibold text-slate-900 dark:text-white">{player.color}</p>
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Money</p>
          <p className="font-semibold text-slate-900 dark:text-white">${player.money}</p>
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Position</p>
          <p className="font-semibold text-slate-900 dark:text-white">{player.position}</p>
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Status</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {player.inJail ? '🔒 Jail' : '🚶 Free'}
          </p>
        </div>
      </div>

      {player.properties.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-xs mb-2">Properties</p>
          <div className="flex flex-wrap gap-1">
            {player.properties.map((prop) => (
              <span
                key={prop}
                className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs rounded font-medium"
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}

      {player.disconnected && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-red-600 dark:text-red-400">
          ⚠️ Disconnected
        </div>
      )}
    </div>
  );
}

interface PropertyCardProps {
  property: property | upgradableProperty | buyableProperty | effectProperty;
}

function PropertyCard({ property: prop }: PropertyCardProps) {
  const hasOwner = 'owner' in prop;
  const hasPrice = 'price' in prop;
  const hasMortgage = 'mortgaged' in prop;
  const hasRent = 'rent' in prop;
  const hasUpgrade = 'level' in prop;
  const hasEffect = 'effect' in prop;

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-slate-900 dark:text-white">{prop.name}</h4>
        {hasOwner && 'owner' in prop && prop.owner && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded">
            {prop.owner}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        Group: <span className="font-semibold text-slate-900 dark:text-white">{prop.group}</span>
      </p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {hasPrice && 'price' in prop && (
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Price</p>
            <p className="font-semibold text-slate-900 dark:text-white">${prop.price}</p>
          </div>
        )}
        {hasUpgrade && 'level' in prop && (
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Level</p>
            <p className="font-semibold text-slate-900 dark:text-white">{prop.level}</p>
          </div>
        )}
        {hasMortgage && 'mortgaged' in prop && (
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Mortgaged</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {'mortgaged' in prop && prop.mortgaged ? '❌ Yes' : '✅ No'}
            </p>
          </div>
        )}
        {hasRent && 'rent' in prop && (
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Rent</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              ${typeof prop.rent === 'number' ? prop.rent : prop.rent[0]}
            </p>
          </div>
        )}
      </div>

      {hasEffect && 'effect' in prop && (
        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
          ✨ {prop.effect}
        </div>
      )}
    </div>
  );
}
