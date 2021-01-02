const express = require("express");
const app = express();
const Post = require("./api/models/posts");
const multer  = require('multer');

//copied from multer docs
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${getExt(file.mimetype)}`)
    }
});

const getExt = (mimetype) => {
    switch(mimetype){
        case "image/png":
            return '.png';
        case "image/jpeg":
            return '.jpg';
    }
}

var upload = multer({storage: storage});
const postsData = new Post();

//converting json to JS object (necessary for NodeJS to parse JSON)
app.use(express.json());

//allowing response (CORS)
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    next();
})

//for making upload folder as static (Public)
app.use("/uploads",express.static('uploads'));


app.get("/api/posts", (req,res) => {
    res.status(200).send(postsData.get());
});

app.get("/api/posts/:post_id",(req,res)=>{
    const postId = req.params.post_id;
    const foundPost = postsData.getIndividualBlog(postId);
    if (foundPost){
        res.status(200).send(foundPost);
    }else{
        res.status(404).send("Post not found");
    }
});

//for ading post to existing data
app.post("/api/posts",upload.single("post-image"),(req,res)=>{
    let fileUrl = req.file.path.replace(/\\/g, "/");
    const newPost = {
        "id": `${Date.now()}`,
        "title": req.body.title,
        "content": req.body.content,
        "post_image": fileUrl,
        "added_date": `${Date.now()}`
    }
    postsData.add(newPost);
    res.status(201).send("Ok");
});

app.listen(3000, () => console.log("Listening on local host 3000!"));