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

});

export default mongoose.model("User",userSchema);