/**
 *
 */
import { join } from 'node:path';

/**
 *
 */
import { program } from 'commander';

/**
 *
 */
import { pathToRootDataFolder } from './core/utils.js';
import { initializeFolders } from './config/initialize-folders.js';
import { initialize } from './handlers/initialize.js';
import { listEntries } from './handlers/list-entries.js';
import { setEntry } from './handlers/set-entry.js';
import { getEntry } from './handlers/get-entry.js';
import { deleteEntry } from './handlers/delete-entry.js';
import { sync } from './handlers/sync.js';

/**
 *
 */
export default async function () {
  await initializeFolders();

  const cli = program
    .name('ccli')
    .description('Minimalist CLI program to store, cipher and decipher data locally.')
    .version(packageContent['version']);

  cli
    .command('path')
    .description('Display the path of the data. (SQLite data)')
    .action(() => {
      console.info(`Root: ${ pathToRootDataFolder }`);

      const sqlPath = join(pathToRootDataFolder, 'main.sql');
      console.info(`SQLite: ${ sqlPath }`)
    });

  cli
    .command('initialize')
    .alias('i')
    .option('-e --erase', 'Delete current configuration and then proceed to create a new one', false)
    .description('Initialize synchronization profile.')
    .action(initialize)

  cli
    .command('sync')
    .alias('s')
    .description('Sync all your ciphered data into an external storage. (Only GCS is available at the moment)')
    .action(sync);

  cli
    .command('list')
    .alias('l')
    .option('-o, --order <string>', 'Order by creation time. (ASC, DESC)', 'DESC')
    .description('List entries existing in the database.')
    .action(listEntries);

  cli
    .command('create <label>')
    .alias('c')
    .option('-h, --hide-text <boolean>', 'Hide the content you prompt.', false)
    .option('-n, --note', 'Ask for a note to explain the label')
    .description('Create an entry with the given label.')
    .action(setEntry);

  cli
    .command('read <label>')
    .alias('r')
    .option('-c, --clipboard', 'Put the deciphered content into the clipboard')
    .description('Read an entry under the given label.')
    .action(getEntry);

  cli
    .command('delete <label>')
    .alias('d')
    .description('Delete an entry under the given label.')
    .action(deleteEntry);

  program.parse();
}
