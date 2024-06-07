/**
 *
 */
import { database } from '../config/database.js';

/**
 *
 */
export function listEntries(str, opts) {
  const db = database();
  // Profiles
  // const profiles = str['order'] === 'DESC'
  //   ? db
  //     .prepare('SELECT * FROM configurations ORDER BY created_at DESC')
  //     .all()
  //   : db
  //     .prepare('SELECT * FROM configurations ORDER BY created_at ASC')
  //     .all();
  //
  // if (profiles.length >= 1) {
  //   console.info('Saved configurations/profiles');
  //   for (const profile of profiles)
  //     console.info(`${ profile['created_at'] }`);
  // } else {
  //   console.info('No profiles/configurations available.');
  // }

  // Entries
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
    for (const entry of entries)
      console.info(`${ entry['created_at'] } | ${ entry['label'] }`);
  } else {
    console.info('No entries available.');
  }
}
