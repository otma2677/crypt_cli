/**
 *
 */
import prompt from 'prompt';
import { database } from '../config/database.js';
import {
  generatePassword,
  cipherGCM,
} from '../core/crypto.js'

/**
 *
 */
export async function setEntry(str, opts) {
  const connection = database();
  const alreadyExist = connection
    .prepare('SELECT * FROM entries WHERE label = ?')
    .get(str);

  if (alreadyExist) {
    console.info(`Entry with the name "${ str }" already exists.`);
    connection.close();
    return;
  }

  const result = await prompt.get({
    properties: {
      password: {
        required: true,
        message: 'Please, enter a password: ',
        hidden: true,
        replace: '*'
      },
      content: {
        required: true,
        message: 'Please, enter your content: ',
        hidden: opts['hide'],
        replace: opts['hide'] ? '*' : null
      }
    }
  });

  const password = generatePassword(result['password']);
  const cipherVectorTag = cipherGCM(result['content'], password.pass);


  const insert = connection
    .prepare('INSERT INTO entries(label, content, salt, vector, tag) VALUES(?, ?, ?, ?, ?, ?)')
    .run(
      str,
      cipherVectorTag.cipher,
      password.salt,
      cipherVectorTag.vector,
      cipherVectorTag.tag
    );

  if (insert.rowsAffected <= 1)
    console.info('An error happened. Retry later.');
  else
    console.info(`Successfully inserted entry under ${ str }.`);

  connection.close();
}
