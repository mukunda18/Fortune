export interface setting {
    /** How many players need to join the game */
    minPlayers: number;
    /** How many players can join the game */
    maxPlayers: number;
    /** Private rooms can be accessed using the room URL only */
    privateRoom: boolean;
    /** Bots will join the game based on availability */
    allowBots: boolean;
    /** If a player owns a full property set, the base rent payment will be doubled */
    doubleRentOnFullSet: boolean;
    /** If a player lands on Vacation, all collected money from taxes and bank payments will be earned */
    vacationCash: boolean;
    /** If someone skips purchasing the property landed on, it will be sold to the highest bidder */
    auction: boolean;
    /** Rent will not be collected when landing on properties whose owners are in prison */
    noRentInPrison: boolean;
    /** Mortgage properties to earn 50% of their cost, but you won't get paid rent when players land on them */
    mortgage: boolean;
    /** Houses and hotels must be built up and sold off evenly within a property set */
    evenBuild: boolean;
    /** Adjust how much money players start the game with */
    startingCash: number;
    /** Randomly reorder players at the beginning of the game */
    randomizePlayerOrder: boolean;
}