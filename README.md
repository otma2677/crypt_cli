# crypt_cli
Minimalist CLI program to store, cipher and decipher data locally, by getting password and randomly generated salt and such and take cares of it.

## Commands
- [help](#help-h-help)
- [version](#version-v-version)
- [initialize](#initialize-i-initialize)
- [sync](#sync-s-sync)
- [list](#list-l-list)
- [create](#create-c-create)
- [read](#read-r-read)
- [delete](#delete-d-delete)

### help (h, help)
Display commands or information of individual command.

### version (v, version)
Display the version of the program.

### Initialize (i, initialize)
> Only Google Cloud Storage is supported at the very moment.

Initialize a configuration for the synchronization feature. You need to setup
a service account a download a key (json), from there you can just feed the
path of the key file, and follow the instruction of the command to
set up the configuration.

You'll be prompted a password, that password will cipher your service account
details, which means that for each synchronization you'll need the same password.

**Options**;
-e, --erase -> Delete the current configuration and restart the initialisation process.

### Sync (s, sync)
If a configuration exists, it sends the .sql file containing all the data (ciphered) over the
wire and save it into a bucket within Cloud storage.

### List (l, list)
List all available entries labels and their creation date, and notes if any is available.

**Options**;
-o, --order -> Sort the results in a certain order by the creation date. By default, set to DESC order.

### Create (c, create)
Create an entry, under the provided label (string without space)

**Options**;
-h, --hide-text -> The provided content (text) will be hidden like passwords when written. By default, set to false.
-n, --note -> Write a note (to help to understand what's all about) along the entry.

### Read (r, read)
Read an entry given the provided label and prompted password.

**Options**;
-c, --clipboard -> Send the result into the clipboard instead of the console. By default, set to false.

### Delete (d, delete)
Delete an entry given the label and the prompted password.
