import { PropertyCard } from "./propertyCard";
import { gameState } from "@/gameInterfaces/gameState";

interface PropertiesSectionProps {
  gameState: gameState;
}

export function PropertiesSection({ gameState }: PropertiesSectionProps) {
  if (Object.keys(gameState.properties).length === 0) {
    return null;
  }

  return (
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
  );
}
