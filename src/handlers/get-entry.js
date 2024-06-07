/**
 *
 */
import prompt from 'prompt';
import clipboard from 'clipboardy';
import { database } from '../config/database.js';
import {
  generatePassword,
  decipherGCM
} from '../core/crypto.js';

/**
 *
 */
export async function getEntry(str, opts) {
  const connection = database();
  const doesItExist = connection
    .prepare('SELECT * FROM entries WHERE label = ?')
    .get(str);

  connection.close();

  if (!doesItExist) {
    console.info(`Entry with label "${ str }" does not exists.`);
    connection.close();
    return;
  }

  const result = await prompt.get({
    properties: {
      password: {
        required: true,
        message: 'Please, enter your password: ',
        hidden: true,
        replace: '*'
      }
    }
  });

  const password = generatePassword(result['password'], doesItExist['salt']);
  const decipher = decipherGCM(
    doesItExist['content'],
    password.pass,
    doesItExist['vector'],
    doesItExist['tag']
  );

  if (opts['clipboard']) {
    await clipboard.write(decipher);
    console.info('Content has been wrote into the clipboard.');
  } else
    console.info(decipher);
}
