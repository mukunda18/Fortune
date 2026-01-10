export enum PropertyType {
    STREET = "STREET",
    TRANSPORT = "TRANSPORT",
    UTILITY = "UTILITY",
    TAX = "TAX",
    SURPRISE = "SURPRISE",
    GO = "GO",
    JAIL = "JAIL",
    GO_TO_JAIL = "GO_TO_JAIL",
    PARKING = "PARKING"
}

export interface propertyGroup {
    id: string;
    name: string;
    color: string;
    properties: string[]; // Property IDs
}

export interface BaseProperty {
    id: string;
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
    amount: number;
}

export interface SurpriseProperty extends BaseProperty {
    type: PropertyType.SURPRISE;
    surpriseType: "CHANCE" | "CHEST";
}

export interface SpecialProperty extends BaseProperty {
    type: PropertyType.GO | PropertyType.JAIL | PropertyType.GO_TO_JAIL | PropertyType.PARKING;
}

export type Property =
    | StreetProperty
    | TransportProperty
    | UtilityProperty
    | TaxProperty
    | SurpriseProperty
    | SpecialProperty;

