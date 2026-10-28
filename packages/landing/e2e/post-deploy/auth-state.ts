import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

// Holds a real session token: gitignored via **/.auth/.
export const AUTH_STATE_PATH = path.join(dir, '.auth', 'user.json');
export const USER_RECORD_PATH = path.join(dir, '.auth', 'user-record.json');
