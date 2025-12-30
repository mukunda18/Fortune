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
