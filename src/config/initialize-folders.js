/**
 *
 */
import { mkdirSync } from 'node:fs';
import { checkPathValidity, pathToRootDataFolder } from '../core/utils.js';

/**
 *
 */
export function initializeFolders() {
  if (!checkPathValidity(pathToRootDataFolder))
    mkdirSync(pathToRootDataFolder);
}
