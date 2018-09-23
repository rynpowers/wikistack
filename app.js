const express = require('express');
const { resolve } = require('path');
const morgan = require('morgan');
const app = express();
const { db, Page, User } = require('./models');

app.use(express.static(resolve(__dirname, 'public')));
app.use(morgan('dev'));

app.get('/', (req, res) => res.redirect('/wiki'));

app.use(express.urlencoded({ extended: false }));
app.use('/wiki', require('./routes/wiki'));
app.use('/users', require('./routes/users'));

const port = 3000;

const connect = async (update = false) => {
  await Page.sync({ force: update });
  await User.sync({ force: update });
  await db.sync();
  app.listen(port, () => console.log(`listening on port ${port}...`));
};

connect(false);
