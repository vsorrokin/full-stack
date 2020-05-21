const { createWriteStream, unlink } = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const shortid = require('shortid');
const filesController = require('../../../controllers/files');

const allowedTypes = ['video', 'cover'];
const UPLOAD_DIR = path.resolve(GCONFIG.API.fileStoragePath);

module.exports = {
  async upload(parent, args, context, info) {

    mkdirp.sync(UPLOAD_DIR);

    if (!allowedTypes.includes(args.type)) {
      throw new Error(JSON.stringify({code: 'incorrect_upload_type'}));
    }

    const MAX_FILE_SIZE = (1024 * 1024) * GCONFIG.maxFileSize[args.type];

    const { createReadStream, filename, mimetype, encoding } = await args.file;

    const stream = createReadStream();
    const id = shortid.generate();
    const fsFileName = `${id}-${filename}`;
    const path = `${UPLOAD_DIR}/${fsFileName}`;

    let currentFileSize = 0;

    // Store the file in the filesystem.
    await new Promise((resolve, reject) => {
      // Create a stream to which the upload will be written.
      const writeStream = createWriteStream(path);

      // When the upload is fully written, resolve the promise.
      writeStream.on('finish', resolve);

      // If there's an error writing the file, remove the partially written file
      // and reject the promise.
      writeStream.on('error', (error) => {
        unlink(path, () => {
          reject(error);
        });
      });

      // In node <= 13, errors are not automatically propagated between piped
      // streams. If there is an error receiving the upload, destroy the write
      // stream with the corresponding error.
      stream.on('error', (error) => writeStream.destroy(error));

      stream.on('data', (data) => {
        currentFileSize += data.length;

        if (currentFileSize > MAX_FILE_SIZE) {
          stream.destroy();
          unlink(path, () => {
            reject(JSON.stringify({code: 'entity_too_large'}));
          });
        }
      });

      // Pipe the upload into the write stream.
      stream.pipe(writeStream);
    });

    const file = {
      name: filename,
      type: mimetype,
      size: currentFileSize,
      local_name: fsFileName
    };

    return (await filesController.create(file))[0];
  }
};
