/**
 *
 */
import { join } from 'node:path';
import { readFileSync, rmSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { Storage } from '@google-cloud/storage';
import prompt from 'prompt';
import { database } from '../config/database.js';
import { checkPathValidity } from '../core/utils.js';
import { cipherGCM, generatePassword } from '../core/crypto.js';

/**
 *
 */
export async function initialize(opts) {
  const connection = database();
  if (opts['erase']) {
    connection
      .prepare('DELETE FROM configurations')
      .run();
  }

  const profile = connection
    .prepare('SELECT * FROM configurations')
    .get();

  if (profile) {
    connection.close();
    console.info(`A configuration/profile already exists and has been done at ${ profile['created_at'] }`);
    return;
  }

  const credentials = await prompt.get({
    properties: {
      key: {
        message: 'Path to the key of your service account',
        required: true
      },
      projectId: {
        message: 'The project within which the bucket will be saved',
        required: true
      },
      pass: {
        message: 'Please, enter a password to cipher your configuration for future usage.',
        required: true,
        hidden: true,
        replace: '*'
      },
      bucket: {
        message: 'optional: Name of the bucket that will be used (will create one name by default)',
        default: `bucket-crypt-cli-${randomBytes(4).toString('hex')}`
      },
      class: {
        message: 'optional: Your storage class (default to standard)',
        default: 'standard'
      },
      location: {
        message: 'optional: Your bucket location (default to US-CENTRAL1)',
        default: 'US-CENTRAL1'
      }
    }
  });

  const pathToKey = join(credentials['key']);
  if (!checkPathValidity(pathToKey)) {
    console.info(`Please, provide a valid path for your credential key. "${ pathToKey }" does not exists.`);
    return;
  }

  try {
    const storage = new Storage({
      keyFilename: pathToKey,
      projectId: credentials['projectId']
    });

    const bucket = await storage.createBucket(
      credentials['bucket'],
      {
        storageClass: credentials['class'],
        location: credentials['location']
      }
    );

    console.info(`Bucket has been created successfully under the name ${ credentials['bucket'] }`);
  } catch (err) {
    console.error('Cannot reach your cloud storage bucket because of the following error')
    console.error(err.message);
    return;
  }

  const generatedPassword = generatePassword(credentials.pass);
  const cipher = cipherGCM(
    JSON.stringify({
      storage: {
        keyFile: JSON.parse(readFileSync(pathToKey, { encoding: 'utf-8' })),
        projectId: credentials['projectId']
      },
      bucket: credentials['bucket']
    }),
    generatedPassword.pass
  );

  rmSync(pathToKey, { force: true })

  const inserted = connection
    .prepare('INSERT INTO configurations(cipher, salt, vector, tag) VALUES(?, ?, ?, ?)')
    .run(cipher.cipher, generatedPassword.salt, cipher.vector, cipher.tag);

  connection.close();
  if (inserted.changes >= 1)
    console.info('Configuration done.');
  else
    console.error('Configuration has not been finished or has been corrupted for unknown reason.');
}
