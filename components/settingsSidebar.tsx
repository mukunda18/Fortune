import { gameState } from "@/gameInterfaces/gameState";

interface SettingsSidebarProps {
  gameState: gameState;
}

export function SettingsSidebar({ gameState }: SettingsSidebarProps) {
  return (
    <div>
      <h2>
        <span>⚙️</span> Settings
      </h2>
      <div>
        {Object.entries(gameState.settings).map(([key, value]) => (
          <div
            key={key}
          >
            <span>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span>
              {typeof value === 'boolean' ? (value ? '✅' : '❌') : value.toString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
