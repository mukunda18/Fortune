enum effect {
    payPlayer,
    payBank,
    jailPlayer,
    payOther,
    getCard,
    movePlayer,
    getBankMoney
}

export interface propertyGroup {
    name: string,
    properties: string[],
}

export interface property {
    name: string,
    group: string,
}

export interface effectProperty extends property {
    effect: effect,
}
export interface buyableProperty extends property {
    price: number,
    baseRent: number,
    owner: string,
    mortgaged: boolean,
}


export interface upgradableProperty extends buyableProperty {
    upgradeCost: number,
    rent: number[],
    level: number,
}