import mongoose from "mongoose";


const messageSchema =
new mongoose.Schema({

  role:{
    type:String,
    enum:[
      "user",
      "assistant"
    ],
    required:true
  },


  content:{
    type:String,
    required:true
  }

},
{
  timestamps:true
});



const conversationSchema =
new mongoose.Schema({

  title:{
    type:String,
    default:"New Chat"
  },


  messages:[
    messageSchema
  ]

},
{
  timestamps:true
});


export default mongoose.model(
  "Conversation",
  conversationSchema
);