const {Schema,model}=require('mongoose')

const commentSchema=new Schema({
    content:{
        type:String,
        required:true,
    },
    blogId:{
        
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true})


module.exports=Comment;