/**
 *
 */
import { join } from 'node:path';
import Database from 'better-sqlite3';
import { pathToRootDataFolder } from '../core/utils.js';

/**
 *
 */
export function database() {
  const pathToDatabase = join(pathToRootDataFolder, 'main.sql');

  const db = Database(pathToDatabase);

  db.exec(`CREATE TABLE IF NOT EXISTS entries (
    id integer primary key not null,
    created_at text default current_timestamp not null,
    label text not null,
    content text not null,
    salt text not null,
    vector text not null,
    tag text not null,
    note text
  );
  
  CREATE TABLE IF NOT EXISTS configurations (
    id integer primary key not null,
    created_at text default current_timestamp not null,
    cipher text not null,
    salt text not null,
    vector text not null,
    tag text not null  
  );
`);

  return db;
}
