/**
 *
 */
import { join } from 'node:path';
import { createReadStream } from 'node:fs';
import { pipeline } from 'stream/promises';
import prompt from 'prompt';
import { Storage } from '@google-cloud/storage';
import { decipherGCM, generatePassword } from '../core/crypto.js';
import { database } from '../config/database.js';
import { pathToRootDataFolder } from '../core/utils.js';

/**
 *
 */
export async function sync(opts) {
  try {
    const connection = database();
    const profile = connection
      .prepare('SELECT * FROM configurations')
      .get();
    connection.close();

    if (!profile) {
      console.info('No profile or configuration available, impossible to sync. Please use command "ccli initialize".');
      return;
    }

    const keys = await prompt.get({
      properties: {
        password: {
          message: 'Please, enter the password related to your configuration',
          required: true,
          hidden: true,
          replace: '*'
        }
      }
    });

    const password = generatePassword(keys.password, profile.salt);
    const decipher = decipherGCM(profile.cipher, password.pass, profile.vector, profile.tag);
    const obj = JSON.parse(decipher);

    const storage = new Storage(obj.storage);
    const bucket = storage.bucket(obj.bucket);
    const readStream = createReadStream(join(pathToRootDataFolder, 'main.sql'));
    const fileName = `sync.sql`;
    const file = bucket.file(fileName);
    const writeStream = await file.createWriteStream();

    await pipeline(
      readStream,
      writeStream
    );

    console.info(`Data has been uploaded under file name "${ fileName }"`);
  } catch (err) {
    console.error('Operation aborted because of following reasons.');
    console.error(err);
    return;
  }
}
