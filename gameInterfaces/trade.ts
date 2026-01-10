export interface Trade {
    id: string;
    fromPlayer: string;
    toPlayer: string;
    propertiesOffered: string[];
    propertiesRequested: string[];
    moneyOffered: number;
    moneyRequested: number;
    cardsOffered: string[];
    cardsRequested: string[];
    isBeingViewed: boolean;
    isValid: boolean;
}