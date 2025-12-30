import { property, upgradableProperty, buyableProperty, effectProperty } from "@/gameInterfaces/property";

interface PropertyCardProps {
  property: property | upgradableProperty | buyableProperty | effectProperty;
}

export function PropertyCard({ property: prop }: PropertyCardProps) {
  const hasOwner = 'owner' in prop;
  const hasPrice = 'price' in prop;
  const hasMortgage = 'mortgaged' in prop;
  const hasRent = 'rent' in prop;
  const hasUpgrade = 'level' in prop;
  const hasEffect = 'effect' in prop;

  return (
    <div>
      <div>
        <h4>{prop.name}</h4>
        {hasOwner && 'owner' in prop && prop.owner && (
          <span>
            {prop.owner}
          </span>
        )}
      </div>

      <p>
        Group: <span>{prop.group}</span>
      </p>

      <div>
        {hasPrice && 'price' in prop && (
          <div>
            <p>Price</p>
            <p>${prop.price}</p>
          </div>
        )}
        {hasUpgrade && 'level' in prop && (
          <div>
            <p>Level</p>
            <p>{prop.level}</p>
          </div>
        )}
        {hasMortgage && 'mortgaged' in prop && (
          <div>
            <p>Mortgaged</p>
            <p>
              {'mortgaged' in prop && prop.mortgaged ? '❌ Yes' : '✅ No'}
            </p>
          </div>
        )}
        {hasRent && 'rent' in prop && (
          <div>
            <p>Rent</p>
            <p>
              ${typeof prop.rent === 'number' ? prop.rent : prop.rent[0]}
            </p>
          </div>
        )}
      </div>

      {hasEffect && 'effect' in prop && (
        <div>
          ✨ {prop.effect}
        </div>
      )}
    </div>
  );
}
