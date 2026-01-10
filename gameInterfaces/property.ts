export enum PropertyType {
    STREET = "STREET", // houses in single group 
    TRANSPORT = "TRANSPORT", //airplanes in single group
    UTILITY = "UTILITY", // electricty and water under each grp
    TAX = "TAX", //luxury fixed and income tax percentage
    SURPRISE = "SURPRISE", // payed money by other or paying to others
    CHEST = "CHEST", // money or pardon card
    CHANCE = "CHANCE", // go to jail effect or repair effect
    GO = "GO", // money giving effect if landed and less if skipped over
    JAIL = "JAIL", // jail
    VACATION = "VACATION" // get bank money effect and rest for certain number turns
}

export interface PropertyGroup {
    name: string;
    color: string;
    properties: string[]; // Property IDs
}

export interface BaseProperty {
    name: string;
    type: PropertyType;
    position: number;
}

export interface BuyableProperty extends BaseProperty {
    price: number;
    mortgageValue: number;
    owner: string | null;
    isMortgaged: boolean;
    groupId: string;
}

export interface StreetProperty extends BuyableProperty {
    type: PropertyType.STREET;
    rent: number[];
    housePrice: number;
    houses: number;
}

export interface TransportProperty extends BuyableProperty {
    type: PropertyType.TRANSPORT;
    rent: number[];
}

export interface UtilityProperty extends BuyableProperty {
    type: PropertyType.UTILITY;
    multipliers: number[];
}


export interface TaxProperty extends BaseProperty {
    type: PropertyType.TAX;
    amount?: number;
    percentage?: number;
}

export interface SurpriseProperty extends BaseProperty {
    type: PropertyType.SURPRISE;
}

export interface ChestProperty extends BaseProperty {
    type: PropertyType.CHEST;
}

export interface ChanceProperty extends BaseProperty {
    type: PropertyType.CHANCE;
}

export interface GoProperty extends BaseProperty {
    type: PropertyType.GO;
}

export interface JailProperty extends BaseProperty {
    type: PropertyType.JAIL;
}

export interface VacationProperty extends BaseProperty {
    type: PropertyType.VACATION;
}

export type Property =
    | StreetProperty
    | TransportProperty
    | UtilityProperty
    | TaxProperty
    | SurpriseProperty
    | ChestProperty
    | ChanceProperty
    | GoProperty
    | JailProperty
    | VacationProperty;

