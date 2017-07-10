const getNextId = (() => {
    let curId = 1;
    function getNextId() {
        return curId++;
    }
    
    return getNextId;
})();

class TopicModel {
    constructor(title, initialPost) {
        this._id = getNextId();
        this._title = title;
        this._posts = [initialPost];
    }
    
    get id() {
        return this._id;
    }
    
    get title() {
        return this._title;
    }
    
    get posts() {
        return this._posts;
    }
    
    addPost(postText) {
        this._posts.push(postText);
    }
} 

module.exports = TopicModel;
