// A simple in-memory store for CSV data to survive edge environments locally
export interface ParsedData {
    id: string;
    filename: string;
    columns: string[];
    rowCount: number;
    summary: string;
    data: any[]; // The raw row data
}

// Ensure this survives HMR in dev mode
const globalForStore = globalThis as unknown as {
    csvStore: Map<string, ParsedData>;
};

export const csvStore = globalForStore.csvStore || new Map<string, ParsedData>();

if (process.env.NODE_ENV !== 'production') {
    globalForStore.csvStore = csvStore;
}
