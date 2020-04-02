const Promise = require('bluebird');
const express = require('express');
const http = require('http');
const config = require('../../../lib/config');

const router = module.exports = express.Router();

router.get('/:urlId.pdf', getPresentation);

function makeDataRequestOptions(urlId) {
  const thisHostName = config.get('http:publicHostName');
  return {
    protocol: config.get('data:protocol') + ':',
    hostname: config.get('data:hostname'),
    path: `/api/kf_pdf/${urlId}?backurl=${thisHostName}`
  };
}

function makeServerErrorResponse(res, err) {
  console.error(err);
  res.status(500).jsend.fail({ message: 'Server Error' });
}

/**
 * Gets the PDF presentation for the given object.
 * @param req {object}
 * @param res {object}
 */
function getPresentation(req, res) {
  const { urlId } = req.params;
  const dataRequestOptions = makeDataRequestOptions(urlId);
  const isDownload = !((req.query || {}).view);

  http.get(dataRequestOptions, (dataRes) => {
    const { statusCode } = dataRes;
    const contentType = dataRes.headers['content-type'];

    dataRes.setEncoding('utf8');
    let rawData = '';
    dataRes.on('data', (chunk) => { rawData += chunk; });
    dataRes.on('end', () => {

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed. Status Code: ${statusCode}`);
        error.rawData = rawData;
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Invalid content-type: Expected application/json but received ${contentType}`);
        error.rawData = rawData;
      }

      if(error) {
        makeServerErrorResponse(res, error);
        return;
      }

      try {
        const parsedData = JSON.parse(rawData);

        if(parsedData && parsedData.hasOwnProperty('data') && parsedData.data.hasOwnProperty('pdf_url')) {
          const pdfUrl = parsedData.data.pdf_url;
          http.request(pdfUrl, (pdfRes) => {
            const fileName = `${urlId}.pdf`;
            if(isDownload) {
              res.set('Content-Disposition', `attachment; filename=${fileName}`);
            }
            res.set('Content-Type', 'application/pdf');
            pdfRes.pipe(res);
          }).end();
        } else {
          error = new Error(`Invalid server response: ${statusCode}`);
          error.rawData = rawData;
          throw error;
        }
      } catch (e) {
        makeServerErrorResponse(res, e);
      }
    });
  })
  .on('error', (e) => {
    makeServerErrorResponse(res, e);
  });
}
