const express=require('express');
const app=express();
const path=require('path');
const userRouter=require('./routes/user');
const connectDB=require('./conn');
const cookieParser=require("cookie-parser");
const blogrouter=require("./routes/blog")
const { checkForAuthenticationCookie } = require('./middleware/auth');
const blogs=require('./models/blog')



app.use(express.static(path.resolve("./public")))

url="mongodb://127.0.0.1:27017/blogDB";
connectDB(url);
const port=process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"))

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));


app.get('/',async (req,res)=>{
    const allblogs=await blogs.find({}).sort("createdAt");
    res.render('home',{
        user:req.user,
        blogs:allblogs
    });
});

app.use('/user',userRouter)
app.use('/blog',blogrouter)


app.listen(port,()=>{
    console.log(`Server started at http://localhost:${port}`);
});
