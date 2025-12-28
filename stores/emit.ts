import { Socket } from "socket.io-client";

export const emitWithTimeout = <T>(socket: Socket, event: string, ...args: any[]): Promise<T> => {
    console.log(`[emitWithTimeout] Emitting event: ${event}`, args);
    return new Promise<T>((resolve, reject) => {
        let called = false;

        const callback = (data: T) => {
            if (!called) {
                called = true;
                console.log(`[emitWithTimeout] Received response for: ${event}`, data);
                resolve(data);
            }
        };

        socket.emit(event, ...args, callback);

        setTimeout(() => {
            if (!called) {
                called = true;
                console.error(`[emitWithTimeout] Timeout for event: ${event}`);
                reject(new Error(`Timeout: ${event}`));
            }
        }, 5000);
    });
};