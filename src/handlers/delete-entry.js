/**
 *
 */
import { database } from '../config/database.js';

/**
 *
 */
export async function deleteEntry (str, opts) {
  const connection = database();

  const result = connection
    .prepare('SELECT * FROM entries WHERE label = ?')
    .get(str);

  if (!result) {
    console.info(`Entry under label "${ str }" does not exists.`);
    return;
  }

  const deleted = connection
    .prepare('DELETE FROM entries WHERE label = ?')
    .run(str);

  connection.close();
  console.info('Successfully deleted');
}
