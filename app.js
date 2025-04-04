const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const connectString = 'mongodb+srv://renusiwan0712:renu2107@cluster0.7fyui.mongodb.net/FCollege'

app.use(bodyParser.json());
app.use(cors()); //enable cors
mongoose
     .connect(connectString, {})
     .then(() => console.log('Connected to MongoDB'))
     .catch((err) => console.error('Error connecting to MongoDB:', err));

     const userSchema = new mongoose.Schema({
        name : {type:String, required:true },
        email : {type:String, required:true},
        org : {type:String, required:true}
     });

     const User = mongoose.model('user', userSchema);

     //routes

     //Create a new user
     app.post('/users', async (req,res)=>{
        try{
            const {name,email, org} = req.body;
            const user = new User({name,email,org});
            await user.save();
            res.status(201).send(user);
        }
        catch(error){
            res.status(500).send(error.message);
        }
     });

     //read all users
     app.get('/users', async (req,res)=>{
        try{
            const users = await User.find();
            res.send(users);
        }
        catch(error){
            res.status(500).send(error.message);
        }
     });

     //read a single user by id
     app.get('/users/:id', async (req,res)=>{
        try{
            const {id} = req.params;
            const user = await User.findById(id);
            if(!user) {
               return res.status(404).send('User not found');
            }
            res.status(200).send(user);
         }catch (error){
            res.status(500).send(error.message);
         }
      });

      //update a user by id
      app.put('/users/:id', async (req,res)=>{
         try{
            const {id} = req.params;
            const {name,email,org} = req.body;
            const user = await User.findByIdAndUpdate
            (id,{name,email,org},{new:true}); 
            if(!user){
               return res.status(404).send('User not found');
            }  
            res.status(200).send('User updated successfully');
         }catch(error){
            res.status(500).send(error.message);
         }
      });

      //delete a user by id
      app.delete('/users/:id', async (req,res)=>{
         try{
            const {id} = req.params;
            const user = await User.findByIdAndDelete(id);
            if(!user){
               return res.status(404).send('User not found');
            }
            res.status(200).send('User deleted successfully');
         }catch(error){
            res.status(500).send(error.message);
         }
      });

     //Start the server
     app.listen(port, ()=>{
        console.log(`server is running on http://localhost:${port}`);
     });