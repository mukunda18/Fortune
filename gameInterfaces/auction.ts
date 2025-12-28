export interface auction {
    active: boolean,
    property: string,
    highestBid: number,
    highestBidder: string,
    auctionTimer: number,
    log: [string, number][]
}