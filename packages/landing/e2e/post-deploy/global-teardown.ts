import fs from 'node:fs';
import { USER_RECORD_PATH } from './auth-state.js';

// The AS has no self-serve delete; agentage/auth's sweep reaps e2e-*@agentage.test users.
export default async function globalTeardown(): Promise<void> {
  fs.rmSync(USER_RECORD_PATH, { force: true });
  fs.rmSync(USER_RECORD_PATH.replace('user-record', 'user'), { force: true });
}
