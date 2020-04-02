const express = require('express');

const router = module.exports = express.Router();

router.use('/regions', require('./regions'));
router.use('/highways', require('./highways'));
router.use('/highway_rings', require('./highway_rings'));
router.use('/counties', require('./counties'));
router.use('/underground_stations', require('./underground_stations'));
router.use('/countries', require('./countries'));
router.use('/cities', require('./cities'));
router.use('/features', require('./features'));
router.use('/compass_directions', require('./compass_directions'));
router.use('/lease_profiles', require('./lease_profiles'));
router.use('/seo_hub_pages', require('./seo_hub_pages'));
