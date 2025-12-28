export interface ServerResponse {
    ok: boolean;
    code: string;
    message?: string;
    details?: any;
}

export function isServerResponse(response: any): response is ServerResponse {
    return response && typeof response === "object" && "ok" in response && "code" in response;
}