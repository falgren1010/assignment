/* eslint-disable @typescript-eslint/no-unused-vars */

export type Result<T> =
    | { success: true; data: T | null }
    | { success: false; message: string }

