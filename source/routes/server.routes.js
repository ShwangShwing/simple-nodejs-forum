const passport = require('passport');

const attach = (app, topicsData, usersData) => {
    app.get('/', (req, res) => {
        const welcomeMessage = `Hello, ${req.user ? req.user.username : 'anonymous user'}`;
        const loggedUser = req.user;
        res.render('home.pug', { welcomeMessage, loggedUser });
    });

    app.get('/topics', (req, res) => {
        const topicsRequest = topicsData.getAll();
        topicsRequest.then((topics) => res.render('topics.pug', { topics }));
    });

    app.get('/new-topic', (req, res) => {
        const loggedUser = req.user;
        if (loggedUser) {
            res.render('new_topic.pug', { loggedUser });
        } else {
            req.flash('error', 'Only logged users can post new topics!');
            res.redirect(302, '/topics');
        }
    });

    app.post('/new-topic', (req, res) => {
        const loggedUser = req.user;
        if (loggedUser) {
            topicsData.addTopic(req.body.title, loggedUser.username, req.body.original_post)
            .then(() => res.redirect(302, '/topics'));
        } else {
            req.flash('error', 'Only logged users can post new topics!');
            res.redirect(302, '/topics');
        }
    });

    app.get('/topic/:topic_id', (req, res) => {
        const loggedUser = req.user;
        const topicId = req.params.topic_id;
        const topicRequest = topicsData.get(topicId);

        topicRequest.then((topic) => {
            const context = { topic: false, loggedUser };
            if (topic) {
                context.topic = topic.title;
                context.posts = topic.posts;
            }
            res.render('topic.pug', context);
        });
    });

    app.post('/topic/:topic_id', (req, res) => {
        const loggedUser = req.user;
        const topicId = req.params.topic_id;

        if (loggedUser) {
            topicsData.addPostToTopic(topicId, req.body.post_text, loggedUser.username)
            .then(() => res.redirect(302, `/topic/${topicId}`));
        } else {
            req.flash('error', 'Only logged users can post in this topic!');
            res.redirect(302, '/topic/' + topicId);
        }
    });

    app.get('/register', (req, res) => {
        res.render('register.pug', { username: '' });
    });

    app.post('/register', (req, res) => {
        usersData.addUser(req.body.username, req.body.password)
            .then(() => res.redirect(302, '/'))
            .catch((error) => {
                req.flash('error', error);
                res.render('register.pug', { username: req.body.username })
            });
    });

    app.get('/login', (req, res) => {
        res.render('login.pug', { username: '' });
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        }));

    app.get('/logout', (req, res) => {
        const loggedUser = req.user;
        if (loggedUser) {
            req.flash('info', `Goodbye ${loggedUser.username}!`);
            req.logout();
        }
        res.redirect(302, '/');
    });
};

module.exports = attach;
