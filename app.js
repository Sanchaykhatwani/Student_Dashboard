const express=require("express");
const app=express();
const mongoose=require("mongoose");
const student=require("./models/student.js");
const methodOverride=require("method-override");

app.use(express.urlencoded({extended:true}));

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js"); 
const session=require("express-session");
const flash=require("connect-flash");



const sessionOptions ={
    secret:"mysuperseceretcode",
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//db
main().then(()=>{
    console.log("database connected successfully..");
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/student");
}

//signup

app.get("/sign",async(req,res)=>{
   
    res.render("sign.ejs");
});

app.post("/signup",async(req,res)=>{
    const {username,email,password}=req.body;
    const newUser = new User({email,username});
    const reguser=await User.register(newUser,password);
    req.flash("success","sign-up done!");
    res.redirect("/student");
})
 
//login
app.get("/login",async(req,res)=>{
   
    res.render("login.ejs");
});

app.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(req,res)=>{
    res.send("login");

})






// student


app.set("view engine","ejs");
app.use(methodOverride("_method"));

app.get("/",async(req,res)=>{
    const cnt=1;
    const students=await student.find({});
    res.render("studentDetail.ejs",{students,cnt});
});

app.get("/student",async(req,res)=>{
    const cnt=1;
    const students=await student.find({});
    res.render("studentDetail.ejs",{students,cnt});
});

app.get("/student/add",(req,res)=>{
    res.render("addStudent.ejs");
});

app.post("/student/dataInsert",async(req,res)=>{
    const {name,branch,email,mobile,city}=req.body;
    const student1=  new student({
        name:name,
        branch:branch,
        email:email,
        mobile:mobile,
        city:city
    });
   await student1.save();
   res.redirect("/student");
});

app.delete("/student/:id",async(req,res)=>{
    const{id}=req.params;
    console.log(id);
    await student.findByIdAndDelete(id);
    res.redirect("/student")
});

app.get("/student/:id/edit",async (req,res)=>{
    const{id}=req.params;
    const std= await student.findById(id);
    res.render("studentedit.ejs",{std});
});

app.patch("/student/:id",async(req,res)=>{
    const{id}=req.params;
    const {name,branch,email,mobile,city}=req.body;
    await student.findByIdAndUpdate({_id:id},{
        name:name,
    branch:branch,
    email:email,
    mobile:mobile,
    city:city,
     },);
    
    res.redirect("/student");

});



app.listen(8080,()=>{
    console.log("listing on port 8080..");
});