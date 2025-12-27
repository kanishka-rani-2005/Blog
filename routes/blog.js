const express = require('express');
const router = express.Router();
const multer=require("multer")
const blog=require('../models/blog');
const comment=require('../models/comment');

const path=require("path")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(`./public/uploads`))
    },
    filename:function(req,file,cb){
        const filename=`${Date.now()}-${file.originalname}`;
        cb(null,filename);
    },
});
const upload=multer({storage:storage});

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    })
})

router.post('/',upload.single('coverImage'),async (req,res)=>{
    // console.log(req.body)
    const {title,body}=req.body
    const Blog=await blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageURL:`uploads/${req.file.filename}`,
    })


    // return res.redirect()
    return res.redirect(`/`)

})


router.get('/:id',async (req,res)=>{
    const getblog=await blog.findById(req.params.id).populate("createdBy");
    const comments=await comment.find({blogId:req.params.id}).populate("createdBy")

    return res.render('blog',{
        user:req.user,
        blog:getblog,
        comments
    })
})

router.post("/comment/:blogId",async(req,res)=>{
   await comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    })
    res.redirect(`/blog/${req.params.blogId}`);
})


module.exports = router;