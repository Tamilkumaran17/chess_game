const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chess')?console.log("yes"):console.log("no");

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
});
const User = mongoose.model('users', UserSchema);
User.createIndexes();

const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());


app.post("/register",async(req,resp)=>{
    try{
        const {username} = req.body;
        const user = new User({name:username});
        let result = await user.save();
        result = result.toObject();
        if (result) {
            resp.send({username});
            console.log(result);
        }
 
    } catch (e) {
        resp.status(500).json({error:"something wrong"});
    }
});
app.listen(5000);