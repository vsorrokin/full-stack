const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const SeoHubPagesController = require(path.resolve('controllers/classifiers/seo_hub_pages'));

router.get('/', listSeoHubPages);
router.get('/sitemap', listSeoSitemap);
router.get('/:urlName', getByUrlName);
router.get('/presets/:urlName', getPresetByUrlName);

function listSeoHubPages(req, res, next) {
  SeoHubPagesController.findAllParent().then(ps => {
    res.jsend.success(ps);
  }, next);
}

function listSeoSitemap(req, res, next) {
  SeoHubPagesController.findAllSitemap().then(ps => {
    res.jsend.success(ps);
  }, next);
}

function getByUrlName(req, res, next) {
  const { urlName } = req.params;
  SeoHubPagesController.findByUrlName(urlName).then(hubPageData => {
    if(!hubPageData) {
      res.status(404).jsend.fail({ message: 'UrlName not found' });
      return;
    }

    SeoHubPagesController.findAllByParent(hubPageData.url).then(presets => {
      if(!presets) {
        res.status(404).jsend.fail({ message: 'Presets not found' });
        return;
      }
      res.jsend.success({ name: hubPageData.name || '', items: presets });
    });
  }, next);
}

function getPresetByUrlName(req, res, next) {
  const { urlName } = req.params;
  SeoHubPagesController.findByUrlName(urlName).then(data => {
    if(data) {
      res.jsend.success(data);
    } else {
      res.status(404).jsend.fail({ message: 'Url not found' });
    }
  }, next);
}
