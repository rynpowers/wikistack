const { addPage, wikiPage, main, editPage } = require('../views');
const { Page, User } = require('../models');

const resolveUser = async body => {
  let { name, email } = body;

  if (!name || !email) throw new Error('must provide both name and email');
  let user = await User.findOne({ where: { email } });
  if (!user) user = await User.create({ name, email });

  return user;
};

const createPageConnection = async (user, body) => {
  const { title, content, status, name } = body;

  if (user.name !== name) throw new Error('user already exists');
  let newPage = await Page.create({
    title,
    content,
    status,
    slug: title,
  });

  let updatedPage = await newPage.setUser(user);
  return updatedPage;
};

const postWiki = async (req, res, next) => {
  try {
    const user = await resolveUser(req.body);
    const page = await createPageConnection(user, req.body);

    res.redirect(`/wiki/${page.slug}`);
  } catch (e) {
    next(e);
  }
};

const getWiki = async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (e) {
    next(e);
  }
};

const getWikiAdd = (req, res) => {
  res.send(addPage());
};

const getWikiArticle = async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
      include: [{ model: User }],
    });

    page
      ? res.send(wikiPage(page, page.user))
      : res.status(404).send('<h1>Page not found</h1>');
  } catch (e) {
    next(e);
  }
};

const getWikiEditPage = async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
      include: [{ model: User }],
    });
    res.send(editPage(page, page.user));
  } catch (e) {
    next(e);
  }
};

const postWikiEditPage = async (req, res, next) => {
  const { content, title, status } = req.body;
  let page = await Page.findOne({ where: { slug: req.params.slug } });
  page = await page.update({ content, title, slug: title, status });

  res.redirect(`/wiki/${page.slug}`);
};

const destroyWikiPage = async (req, res, next) => {
  await Page.destroy({ where: { slug: req.params.slug } });
  res.redirect('/wiki');
};

module.exports = {
  postWiki,
  getWiki,
  getWikiAdd,
  getWikiArticle,
  getWikiEditPage,
  postWikiEditPage,
  destroyWikiPage,
};
