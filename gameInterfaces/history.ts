export interface HistoryEntry {
    type: string;
    timestamp: number;
    player: string;
    message: string;
    payload?: any;
}
