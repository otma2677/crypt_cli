/**
 *
 */
import { join } from 'node:path';
import { accessSync } from 'node:fs';
import { homedir } from 'node:os';

/**
 *
 */
export const pathToRootDataFolder = join(
  homedir(),
  'crypt_cli'
);

/**
 * Function utilities
 */
export function checkPathValidity(path) {
  try {
    accessSync(path);
    return true;
  } catch (err) {
    return false;
  }
}
