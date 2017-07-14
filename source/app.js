const bodyParser = require('body-parser');
const db = require('./db/db.js').init('mongodb://localhost/simpleforum');
const cookieParser = require('cookie-parser');
const session = require('express-session');

db.then((database) => {
    const topicsData = require('./data/topics.data.js')(database);
    const usersData = require('./data/users.data.js')(database);
    return { topicsData, usersData };
}).then(({ topicsData, usersData }) => {
    const express = require('express');
    const app = express();

    app.use(cookieParser('keyboard cat'));
    app.use(session({ cookie: { maxAge: 60000 } }));

    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(
        function(username, password, done) {
            usersData.checkValidUserUsername(username, password)
                .then((user) => done(null, user))
                .catch((error) => {
                    done(null, false, { message: 'Invalid login credentials!' });
                });
        }
    ));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        usersData.get(id).then((userWithoutPassword) => done(null, userWithoutPassword));
    });

    app.set('view engine', 'pug');

    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    app.use(require('connect-flash')());
    app.use((req, res, next) => {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    require('./routes/server.routes.js')(app, topicsData, usersData);

    app.listen(3212, () => console.log('Server is listening on port 3212'));
});

