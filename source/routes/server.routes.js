const attach = (app, data) => {
    app.get('/', (req, res) => {
        res.render('home.pug', {motd: "Hello, anonymous user"});
    });
    
    app.get('/topics', (req, res) => {
        const topics = data.getAll();
        topics.then((topics) => res.render('topics.pug', {topics}));        
    });
    
    app.get('/new-topic', (req, res) => {
        res.render('new_topic.pug');
    });
    
    app.post('/new-topic', (req, res) => {
        data.addTopic(req.body.title, req.body.original_post);
        res.redirect(302, '/topics');
    });
    
    app.get('/topic/:topic_id', (req, res) => {
        const topicId = req.params.topic_id
        const topic = data.get(topicId);
        let context;
        if (topic) {
            context = {topic: topic.title, posts: topic.posts};
        }
        else {
            context = {topic: false}
        }
        
        res.render('topic.pug', context);
    })
    
    app.post('/topic/:topic_id', (req, res) =>  {
        const topicId = req.params.topic_id;
        
        data.addPostToTopic(topicId, req.body.post_text);
        
        res.redirect(302, `/topic/${topicId}`);
    });
}

module.exports = attach; 
