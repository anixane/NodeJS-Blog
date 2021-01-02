const PATH = "./data.json";
const fs = require('fs');

class Post {
    get(){
        return this.readData();
    }

    getIndividualBlog(postId){
        const posts = this.readData();
        const foundPost = posts.find((post)=>post.id == postId);
        return foundPost;
    }

    add(newPost){
        const currentData = this.readData();
        currentData.unshift(newPost);
        this.saveData(currentData);
    }

    readData(){
        let rawData = fs.readFileSync(PATH);
        let postsData = JSON.parse(rawData);
        return postsData;
    }

    saveData(rawData){
        //this will read the data and overwrites the existing file
        let newData = JSON.stringify(rawData);
        fs.writeFileSync(PATH,newData);
    }
}

module.exports = Post;