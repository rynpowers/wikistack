const express = require('express');
const router = express.Router();
const helpers = require('./wikiHelpers');

router.get('/', helpers.getWiki);

router.post('/', helpers.postWiki);

router.get('/add', helpers.getWikiAdd);

router.get('/:slug', helpers.getWikiArticle);

router.get('/:slug/edit', helpers.getWikiEditPage);

router.post('/:slug/edit', helpers.postWikiEditPage);

router.get('/:slug/delete', helpers.destroyWikiPage);

module.exports = router;
