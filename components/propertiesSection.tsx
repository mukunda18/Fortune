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
    <div>
      <h2>
        <span>🏢</span> Properties ({Object.keys(gameState.properties).length})
      </h2>
      <div>
        {Object.entries(gameState.properties).map(([propId, prop]) => (
          <PropertyCard key={propId} property={prop} />
        ))}
      </div>
    </div>
  );
}
