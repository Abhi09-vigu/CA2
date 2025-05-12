const express = require("express");
const mongoose = require("mongoose")
require('dotenv').config()
const cors = require("cors")
const Books = require("./schema")

const port = process.env.PORT || 4000
const app = express();

app.use(express.json());
app.use(cors());

app.post('/books',async(req,res)=>{
    try {
        const {title , author , genre , publishedYear , availableCopies , borrowedBy} = req.body

        if(!title || !author ||  !genre || !publishedYear || !availableCopies || !borrowedBy){
            return res.status(400).json({message: "All feild are required"});
        }
        const newBook = new Books({title , author , genre , publishedYear , availableCopies , borrowedBy});
        await newBook.save();
        return res.status(201).json({message: "Books are saved",newBook});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
});


app.get('/books',async(req,res)=>{
    try {
        const books = await  Books.find();
        return res.status(201).json({message: "Books fetched succussfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"});
    }
});
 
app.put('/books/:id',async(req,res)=>{
    try {
        const updated = await Books.findByIdAndUpdated(req.params.id , req.body , {new: true});
        if(!updated){
            res.status(404).json({message: "Books are not found"});
        }
        return res.status(201).json({message: "Books are updated succussfully",updated})
    } catch (error) {
        return res.status(500).json({message: "Internal server problem"})
    }
});

app.delete('/books/:id',async(req,res)=>{
    try {
        const deleted = await Books.findByIdAndDeleted(req.params.id);
        if(!deleted){
            res.status(404).json({message: "Books are not found"});
        }
        return res.status(201).json({message: "Books are updated succussfully"})
    } catch (error) {
        return res.status(500).json({message: "Internal server problem"});
    }
});


const db = async()=>{
    try {
        await mongoose.connect(process.env.mongodb);
        console.log("MongoDb is connected");
    } catch (error) {
        console.error("MongoDB failed",error);
    }
};
db();

app.get('/',async(req,res)=>{
    res.send("Books API is running");
});

app.listen(port,()=>{
    console.log(`server is running http://localhost:${port}`)
})