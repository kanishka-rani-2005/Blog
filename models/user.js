const mongoose = require('mongoose');
const {createHmac, randomBytes}=require('crypto');
const {createTokenForUser}=require("../services/auth")

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    
    profileImageUrl: {
        type: String,
        default:"../public/user.png"
    },
    role:{
        type:String,
        enum:['ADMIN','USER'],
        default:'USER'
    }

},{timestamps:true});

userSchema.pre('save', function (next) {
    const user=this;
    if (!user.isModified('password')) return ;

    //hash password
    const salt=randomBytes(16).toString('hex');
    const hashedPassword=createHmac('sha256',salt)
        .update(user.password)
        .digest('hex');
    this.password=hashedPassword;
    this.salt=salt;
    // next();
});

userSchema.static('matchPasswordandGenerateToken', async function (email, password){
    const user=await this.findOne({email:email});
    if(!user) throw new Error('User not found');
    const salt=user.salt;
    const hashedPassword=user.password;

    const userProviedHashedPassword=createHmac('sha256',
        salt)
        .update(password)
        .digest('hex');
        if(hashedPassword!=userProviedHashedPassword) throw new Error('Password not matched.')

        const token=createTokenForUser(user)
    return token
});     


const user = mongoose.model('user', userSchema);

module.exports = user;

