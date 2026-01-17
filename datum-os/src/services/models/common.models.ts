
export type Result<T> =
    | { success: true; data: T | null }
    | { success: false; message: string }

