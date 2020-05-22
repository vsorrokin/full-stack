const { createWriteStream, unlink } = require('fs');
const sharp = require('sharp');
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
    const fsBlurredFileName = `${id}-blurred-${filename}`;
    const path = `${UPLOAD_DIR}/${fsFileName}`;
    const pathForBlurred = `${UPLOAD_DIR}/${fsBlurredFileName}`;

    let currentFileSize = 0;
    let buffer = [];

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
        if (args.type === 'cover') {
          buffer.push(data);
        }

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

    const options = {};

    if (args.type === 'cover') {
      buffer = Buffer.concat(buffer);

      const fileInfo = await new Promise(function(resolve, reject) {
        const radius = 200;
        const padding = 400;
        sharp(buffer)
          .toFormat('png', {palette: true})
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .blur(1 + radius / 2)
          .toFile(pathForBlurred, (err, info) => {
            if (err) {
              reject(err);
            } else {
              resolve(info);
            }
          });
      });

      const file = {
        name: fsBlurredFileName,
        type: mimetype,
        size: fileInfo.size,
        local_name: fsBlurredFileName,
        options
      };

      const blurredFileDB = (await filesController.create(file))[0];

      options.blurredId = blurredFileDB.id;
    }


    const file = {
      name: filename,
      type: mimetype,
      size: currentFileSize,
      local_name: fsFileName,
      options
    };

    return (await filesController.create(file))[0];
  }
};
