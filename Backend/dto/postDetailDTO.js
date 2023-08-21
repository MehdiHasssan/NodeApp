class PostDetailDTO{
    constructor(post){
        this._id = post._id;
        this.content = post.content;
        this.title = post.title;
        this.photo = post.photoPath;
        this.createdAt = post.createdAt;
        this.authorName = post.author.name;
        this.authorUsername = post.author.username;
    }
}

module.exports = PostDetailDTO;