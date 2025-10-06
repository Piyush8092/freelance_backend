const mongoose=require('mongoose');

const contactSchama=new mongoose.Schema({
      subject:{
        type:String,
        required:true
    },    message:{
        type:String,
        required:true
    },
    
    userId:{
type: mongoose.Schema.Types.ObjectId,
    ref: 'user',    }
})

  const ContactModel=mongoose.model("ContactModel",contactSchama);

  module.exports=ContactModel