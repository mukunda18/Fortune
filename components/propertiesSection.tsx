import { PropertyCard } from "./propertyCard";
import { GameState } from "@/gameInterfaces/gameState";

interface PropertiesSectionProps {
  gameState: GameState;
}

export function PropertiesSection({ gameState }: PropertiesSectionProps) {
  const properties = Object.entries(gameState.properties);

  if (properties.length === 0) return null;

  return (
    <section>
      <h3>🏢 Properties ({properties.length})</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {properties.map(([id, prop]) => (
          <PropertyCard key={id} property={prop} />
        ))}
      </div>
    </section>
  );
}
