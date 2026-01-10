export interface Auction {
    active: boolean;
    propertyId: string;
    highestBid: number;
    highestBidder: string;
    auctionTimer: number;
    log: { bidder: string; amount: number; timestamp: number }[];
}
