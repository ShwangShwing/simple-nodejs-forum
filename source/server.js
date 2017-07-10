const bodyParser = require('body-parser')
const db = require('./db/db.js').init('mongodb://localhost/simpleforum');
db.then(db => {
    const topicsData = require('./data/topics.data.js')(db);
    return topicsData;
}).then(topicsData => {
    const express = require('express');
    const app = express();

    app.set('view engine', 'pug');

    app.use(bodyParser.urlencoded({ 
        extended: true
    })); 

    require('./routes/server.routes.js')(app, topicsData);

    app.listen(3212, () => console.log('Server is listening on port 3212'));
})



