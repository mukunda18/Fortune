import { Property, PropertyType, StreetProperty, TransportProperty, UtilityProperty, TaxProperty } from "@/gameInterfaces/property";

interface PropertyCardProps {
  property: Property;
  groupColor?: string;
}

export function PropertyCard({ property: prop, groupColor = "#ccc" }: PropertyCardProps) {
  const isStreet = prop.type === PropertyType.STREET;
  const isTransport = prop.type === PropertyType.TRANSPORT;
  const isUtility = prop.type === PropertyType.UTILITY;
  const isTax = prop.type === PropertyType.TAX;
  const buyable = "price" in prop ? (prop as StreetProperty | TransportProperty | UtilityProperty) : null;

  return (
    <article>
      <header style={{ borderTop: `8px solid ${isStreet ? groupColor : "#333"}` }}>
        <h4>{prop.name}</h4>
      </header>

      {buyable && (
        <section>
          <ul>
            {isStreet && (prop as StreetProperty).rent.map((r, i) => (
              <li key={i}>
                {i === 0 ? "Base" : i === 5 ? "Hotel" : `${i} House`} : ${r}
              </li>
            ))}
            {isTransport && (prop as TransportProperty).rent.map((r, i) => <li key={i}>{i + 1} RR: ${r}</li>)}
            {isUtility && (prop as UtilityProperty).multipliers.map((m, i) => <li key={i}>{i + 1} Util: {m}x</li>)}
          </ul>
          <p>Price: ${buyable.price} | Mortgage: ${buyable.mortgageValue}</p>
        </section>
      )}

      {isTax && <p>Tax: ${(prop as TaxProperty).amount}</p>}

      {buyable?.owner && (
        <footer>
          Owner: {buyable.owner} {buyable.isMortgaged && "(Mortgaged)"}
        </footer>
      )}
    </article>
  );
}
