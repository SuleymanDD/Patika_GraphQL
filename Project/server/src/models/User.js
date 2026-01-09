import mongoose from "mongoose"
const Schema = mongoose.Schema;

const userSchema = new Schema({
   fullName:{
    type: String,
    requried: true,
   },
   age:{
    type: Number,
    requried: true,
   },
   profile_photo:String,
   posts: [
      {
         type: Schema.Types.ObjectId,
         ref: "Post"
      },
   ],
   comments: [
      {
         type: Schema.Types.ObjectId,
         ref: "Comment"
      },
   ]

});

export default mongoose.model("User",userSchema);