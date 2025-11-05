const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const app = express();
const sessionMiddleware = require('./session/session.js');
const loginRouter = require('./route/login/login.js');
const registerRouter = require('./route/register/register.js');
const mainRouter = require('./route/main/main.js');
const atomRouter = require('./route/atom/atom.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(sessionMiddleware);
app.use('/',loginRouter);
app.use('/',registerRouter);
app.use('/',mainRouter);
app.use('/',atomRouter);

app.set('view engine', 'html');
nunjucks.configure('views', {
    autoescape: true,
    express: app
}).addFilter('nl2br', str => {
    if (!str) return '';
    return str.replace(/\n/g, '<br>');x
});

app.listen(8000, (req,res) => {
    console.log('http://localhost:8000');
})