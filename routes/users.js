const express = require('express');
const router = express.Router();
const { User, Page } = require('../models');
const { userList, userPages } = require('../views');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(userList(users));
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [{ model: Page }],
    });
    res.send(userPages(user, user.pages));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
