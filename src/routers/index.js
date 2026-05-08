const siteRouter = require('./siteRouter');
const userRouter = require('./usersRouter');

function route(app) {
    app.use('/', siteRouter);
    app.use('/users', userRouter);
}

module.exports = route;