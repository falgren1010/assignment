import type {Context} from "hono";
import { AppError, NotFoundError, ValidationError, InternalServerError } from "../services/models/errors.js";

export function renderError(err: AppError, c: Context) {
    if (err instanceof ValidationError) {
        return c.json({ error: err.message }, 400);
    }

    if (err instanceof NotFoundError) {
        return c.json({ error: err.message }, 404);

    }

    if (err instanceof InternalServerError) {
        return c.json({ error: err.message }, 500);
    }

    return c.json({ error: "Internal Server Error: Unknown Error"}, 500);
}
