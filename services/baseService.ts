import { getDefaultStore } from "jotai";

export abstract class BaseService {
    protected store = getDefaultStore();
    protected abstract name: string;

    protected log(message: string, ...args: any[]) {
        console.log(`[${this.name}] ${message}`, ...args);
    }

    protected error(message: string, ...args: any[]) {
        console.error(`[${this.name}] ${message}`, ...args);
    }

    protected warn(message: string, ...args: any[]) {
        console.warn(`[${this.name}] ${message}`, ...args);
    }
}
