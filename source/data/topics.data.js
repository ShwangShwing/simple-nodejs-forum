const TopicModel = require('../models/topic.model.js')

class TopicsData {
    constructor(db) {
        this._db = db;
        this._collection = this._db.collection('topics');
    }
    
    addTopic(title, originalPost) {
        const newTopic = new TopicModel(title, originalPost);
        const id = newTopic.id;

        this._collection.insert(newTopic)
            .then(() => newTopic);
    }
    
    getAll() {
        const result = this._collection
            .find({}, {})
            .toArray();
        
        return result;
    }
    
    get(id) {
        const topic = this._topics.filter(topic => topic.id == id)[0];
        return topic;
    }
    
    addPostToTopic(topicId, postText) {
        const topic = this.get(topicId);
        if (topic) {
            topic.addPost(postText);
        }
    }
}

function init(db) {
    return new TopicsData(db);
}

module.exports = init;
