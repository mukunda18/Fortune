import { GameState } from "@/gameInterfaces/gameState";

interface SettingsSidebarProps {
  gameState: GameState;
}

export function SettingsSidebar({ gameState }: SettingsSidebarProps) {
  return (
    <aside>
      <h3>⚙️ Settings</h3>
      <ul>
        {Object.entries(gameState.settings).map(([key, value]) => (
          <li key={key}>
            {key.replace(/([A-Z])/g, ' $1').trim()}:
            <strong>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</strong>
          </li>
        ))}
      </ul>
    </aside>
  );
}
