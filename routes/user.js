const express = require('express');
const router = express.Router();
const User=require('../models/user');

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup',async  (req, res) => {
    const {fullName,email,password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    res.redirect('/');
});


router.post('/signin', async (req, res) => {
    try{
    const {email,password} = req.body;
    const token=await User.matchPasswordandGenerateToken(email,password)

    // console.log(token)
    // res.redirect("/")
    return res.cookie('token',token).redirect('/')
    }catch(err){
    return res.render("signin",{
        error:"Incorrect Email or Password"
    })
}

});


router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect('/' )
})

module.exports = router;