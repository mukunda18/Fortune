export enum PropertyType {
    UTILITY,
    TAX,
    TREASURE,
    JAIL,
    GO_TO_JAIL,
    VACATION,
    GO
}

export enum TreasureAction {
    MOVE_TO,
    MOVE_STEPS,
    MOVE_NEAREST,
    PAY_BANK,
    PAY_PLAYERS,
    PAYED_BY_PLAYERS,
    GO_TO_JAIL,
    PARDON_CARD,
    REPAIR
}

export interface TreasureCard {
    id: string;
    description: string;
    action: TreasureAction;
    amount?: number;
    target?: string;
    subAmount?: number;
}

export interface propertyGroup {
    name: string;
    color: string;
    properties: string[];
}

export interface baseProperty {
    id: string;
    name: string;
    type: PropertyType;
    position: number;
}

export interface taxProperty extends baseProperty {
    type: PropertyType.TAX;
    taxAmount: number;
}

export interface treasureProperty extends baseProperty {
    type: PropertyType.TREASURE;
}

export interface jailProperty extends baseProperty {
    type: PropertyType.JAIL;
}

// Buyable Properties

export interface buyableProperty extends baseProperty {
    group: string; // Group ID
    price: number;
    baseRent: number;
    owner: string | null;
    mortgaged: boolean;
}

export interface utilityProperty extends buyableProperty {
    type: PropertyType.UTILITY;
}

export type Property =
    | utilityProperty
    | taxProperty
    | treasureProperty
    | jailProperty
    | baseProperty;
