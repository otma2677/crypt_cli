#! node
import program from '../src/index.js';

await program();

process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  console.error('\noperations aborted.');
  console.error(err);
});
