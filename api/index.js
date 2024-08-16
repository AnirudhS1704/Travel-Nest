dotenv = require('dotenv')
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/Users.js");
const Place = require("./models/Places.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
const ImageDownloader = require("image-downloader");
const multer = require('multer');
const fs = require('fs');
const { fail } = require('assert');
const Booking = require('./models/Booking.js');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "ca5d75b207784d702dbafb074eeafc4caa11b2fae5709a2c5fb0a69c353c1e6f77caa584be3af743b1117677bda7b1937221bfa335a22b614a69df5c33e3246";

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
app.use(cookieParser());
app.use(cors({credentials: true}));
app.use(express.json());
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use(bodyParser.urlencoded({
    extended: true,
}));

const mongo_un=process.env.MONGO_UID
const pwd=process.env.MONGO_PWD

mongoose.connect('mongodb+srv://'+mongo_un+':'+pwd+'@cluster0.n8gfnvm.mongodb.net/?retryWrites=true&w=majority');


app.get("/test", (req, res)=>{
    res.json("test-ok");
});

app.post("/signup", async(req, res)=>{
    const {name, email, password} = req.body;
    try {
        const myUser = await User.create({
            name: name,
            email: email,
            password: bcrypt.hashSync(password, bcryptSalt)
        });
        res.json(myUser);
    } catch (err) {
        res.status(422).json(err);
    }
});

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
  

app.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    myUserFound = await User.findOne({email});
   
      localStorage.setItem('email', email);
      console.log("in login: "+localStorage.getItem('email'));
    if (myUserFound) {
        const passOk = bcrypt.compareSync(password, myUserFound.password);
        console.log(passOk);
        if (passOk) {
            const token = jwt.sign(email, jwtSecret);
            res.cookie('token', token, {httpOnly: false, path: "/",domain: "http://localhost:3000"}).json(myUserFound);
            
        }
        else{
            res.status(422).json("Password wrong")
        }
    }
    else{
        res.json();
    }
})



app.get("/profile", (req, res)=>{
    const {token} = req.cookies;
    console.log(token);
    if (token) {
        jwt.verify(token, jwtSecret, {}, async(err, user)=>{
            if (err) {
                throw err;
            } 
            console.log("user: "+user);
            req.app.locals.userDoc = await User.findById(user.id);
            res.json(userDoc); 
        })
    }
        else {
            res.json(null);
        }
    
})

app.post("/logout", (req, res)=>{
    localStorage.removeItem('email');
    res.cookie("token", '').json(true);
})

app.post("/upload-by-link", async(req, res)=>{
    const {link} = req.body;
    const newName = new Date().getDate() + "-"+new Date().getMonth()+ "-"+new Date().getFullYear()+ "-"+new Date().getTime()+".jpg";
    await ImageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    }).then(({ filename }) => {
        console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
      })
      .catch((err) => console.error(err));
    res.json(newName);
})

const photosMiddleware = multer({dest: 'uploads'});

app.post("/upload", photosMiddleware.array('photos', 100), (req, res)=>{
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
     const {path, originalname} = req.files[i];
     const parts = originalname.split('.');
     const newPath = path + '.' + parts[parts.length-1];
     fs.renameSync(path, newPath);
     uploadedFiles.push(newPath.replace("uploads", ""));
    }
    res.json(uploadedFiles);
})

app.post("/save-places", async(req, res,)=>{ 
    const {title, address, addPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
    console.log(addPhotos);
    console.log(typeof(addPhotos[0]));
    const email = localStorage.getItem('email');
    console.log("In add place: "+email);
    const UserFound = await User.findOne({email});
    const id = UserFound._id;


    console.log("Id: "+id);
            const placeDoc =   Place.create(({
                owner: id,
                title: title,
                address: address,
                description: description,
                photos: addPhotos,
                perks: perks,
                extraInfo: extraInfo,
                checkIn: checkIn,
                checkOut: checkOut, 
                maxGuests: maxGuests,
                price: price,
            }))
            res.json(id);     
    });

    app.get("/user-places", async(req, res)=>{
        const {token} = req.cookies;
        console.log("token: "+JSON.stringify(req.cookies));
        const email = localStorage.getItem('email');
        const UserFound = await User.findOne({email});
        const id = UserFound._id;
        const places = await Place.find({owner: id});
        res.json(places);
    })

    app.get("/places/:id", async(req, res)=>{
        const {id} = req.params;
        idd = id.split(":")[1];
        idd = idd.split('"')[1];
        idd = idd.split('"')[0];
        idd = idd.split("}")[0];
        res.json(await Place.findOne({_id: idd}));
    })

    app.put("/places", async(req, res)=>{
        const email = localStorage.getItem('email');
        const {id, title, address, addPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
        console.log(id);
        idd = id.split(":")[1];
        console.log(idd);
        idd = idd.split('"')[1];
        console.log(idd);
        idd = idd.split('"')[0];
        console.log(idd);
        idd = idd.split("}")[0];
        console.log(idd);
        const placeDoc = await Place.findOne({_id: idd});
        console.log(email);
        console.log(placeDoc);
        var email1 = await User.findOne({email: email});
        email1 =email1.email;
        console.log(email1 === email)
        if (email1 === email) {
            
            placeDoc.set({
                title: title,
                address: address,
                description: description,
                photos: addPhotos,
                perks: perks,
                extraInfo: extraInfo,
                checkIn: checkIn,
                checkOut: checkOut, 
                maxGuests: maxGuests,
                price: price,
            });
            placeDoc.save();
            res.json("ok");
            
        }
        else{
            res.json("failed");
        }     
    })

    app.get("/places", async(req, res)=>{
        const places = await Place.find();
        res.json(places);
    })

    app.get("/place/:id", async(req, res)=>{
        const {id} = req.params;
        console.log(id);
        res.json(await Place.findOne({_id: id}));
    })

    app.post("/bookings", async(req, res)=>{
        
        const {place, checkIn, checkOut, numberOfGuests, name, phone, price} = req.body;
        console.log(place, checkIn, checkOut, numberOfGuests, name, phone, price);
        const placeFromDb = await Place.findOne({_id: place});
        console.log(placeFromDb);
        const email = localStorage.getItem('email');
        console.log(email);
        const myuser = await User.findOne({'email': email});
        console.log("user: "+myuser);
        const id = myuser._id;
        console.log("id: "+id);
        const doc = await Booking.create({
            place: placeFromDb._id, user: id, checkIn, checkOut, name, phone, numberOfGuests, price
        });
        res.json(doc);
    })

    app.get("/bookings-verify-logged-in", (req, res)=>{
       const email =  localStorage.getItem('email');
       res.json(email);
    })

    app.get("/bookings", async(req, res)=>{
        const email = localStorage.getItem('email');
        const user = await User.findOne({'email': email});
        const userId = user._id;
        console.log(userId);
       const bookings = await Booking.find({user: userId}).populate('place');
       console.log(bookings);
        res.json(bookings);
    })



app.listen(port)