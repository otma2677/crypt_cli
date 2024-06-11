/**
 *
 */
import { database } from '../config/database.js';

/**
 *
 */
export function listEntries(str, opts) {
  const db = database();
  const entries = str['order'] === 'DESC'
    ? db
      .prepare('SELECT * FROM entries ORDER BY created_at DESC')
      .all()
    : db
      .prepare('SELECT * FROM entries ORDER BY created_at ASC')
      .all();

  db.close();

  if (entries.length >= 1) {
    console.info('Saved entries');
    for (const entry of entries) {
      if (entry['note'])
        console.info(`${ entry['created_at'] } - ${ entry['label'] } | note -> ${ entry['note'] }`);
      else
        console.info(`${ entry['created_at'] } - ${ entry['label'] }`);
    }
  } else {
    console.info('No entries available.');
  }
}
