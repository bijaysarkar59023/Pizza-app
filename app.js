var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user.js"),
    methodOverride = require("method-override"),
    path = require("path");
    // session = require("express-session");
    
mongoose.connect("mongodb://localhost/sample",{ useMongoClient: true });
var pizzaSchema = new mongoose.Schema({
 name:String,
 img:String,
 desc:String,
 size:String,
 crust:String,
 price:Number
});
var mealsSchema = new mongoose.Schema({
 name:String,
 img:String,
 desc:String,
 price:Number
});
var drinksSchema = new mongoose.Schema({
 name:String,
 img:String,
 price:Number
});
var orderSchema = new mongoose.Schema({
 username:String,
 phone:Number,
 foodId:String,
 orderId:String
});
var Order = mongoose.model("Order", orderSchema);
var Pizza = mongoose.model("Pizza", pizzaSchema);
var Meal = mongoose.model("Meal", pizzaSchema);
var Drink = mongoose.model("Drink", pizzaSchema);

var app = express();
app.use(function(req,res,next){
 res.locals.currentUser=req.user;
});
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require("express-session")({
 secret:"I Am The Best",
 resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req, res){
 Pizza.find({},function(err,pizza){
  if(err){
    console.log(err);
  }else{
    res.render("index",{pizzas:pizza});
  }
 });
});

app.get("/meals",function(req, res){
 Meal.find({},function(err,meals){
  if(err){
    console.log(err);
  }else{
    res.render("meals",{meals:meals});
  }
 });
});

app.get("/drinks",function(req, res){
 Drink.find({},function(err,drinks){
  if(err){
    console.log(err);
  }else{
    res.render("drinks",{drinks:drinks});
  }
 });
});


app.get("/addPizza",isLoggedIn,function(req, res){
 res.render("addPizza");
});
app.post("/addPizza",isLoggedIn,function(req, res){
 Pizza.create(req.body.Pizza,function(err, newPizza){
    if(err){
       console.log(err);
    }else{
      res.redirect("/");
    }
  });
});


app.get("/addMeal",isLoggedIn,function(req, res){
 res.render("addMeal");
});
app.post("/addMeal",isLoggedIn,function(req, res){
 Meal.create(req.body.Meal,function(err, newMeal){
    if(err){
       console.log(err);
    }else{
      res.redirect("/meals");
    }
  });
});



app.get("/addDrink",isLoggedIn,function(req, res) {
 res.render("addDrink");
});
app.post("/addDrink",isLoggedIn,function(req, res){
 Drink.create(req.body.Drink,function(err, newDrink){
    if(err){
       console.log(err);
    }else{
      res.redirect("/drinks");
    }
  });
});

//AUTHENTICATE ROUTES
app.get("/auth",function(req, res){
 res.render("login");
});

app.post("/auth/register",function(req,res){
 User.register(new User({username:req.body.username, name:req.body.name, phone:req.body.phone, email:req.body.email}),req.body.password,function(err, user){
  if(err){
   console.log(err);
   res.redirect("/")
  }else{
   passport.authenticate("local")(req,res,function(){
    res.redirect("/meals");
    console.log("new user was created");
   });
  }
 });
});

app.post("/auth/login", passport.authenticate("local",{
  successRedirect:"/meals",
  failureRedirect:"/"
}),function(req, res){
 
});

app.get("/logout",function(req, res){
 req.logout();
 res.redirect("/");
});

function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
  return next();
 }
 res.redirect("/auth");
}

//EACH SECTION ROUTE
app.get("/:id/edit",function(req, res){
 Pizza.findById(req.params.id,function(err, pizza){
  if(err){
   console.log(err);
  }else{
   res.render("editPizza",{pizza:pizza});
  }
 });
});

app.put("/:id",function(req, res){
 Pizza.findByIdAndUpdate(req.params.id,req.body.Pizza,function(err, pizza){
  if(err){
   console.log(err);
  }else{
   res.redirect("/");
  }
 });
});

app.get("/meals/:id/edit",function(req, res){
 Meal.findById(req.params.id,function(err, meal){
  if(err){
   console.log(err);
  }else{
   res.render("editMeal",{meal:meal})
  }
 })
});

app.put("/meals/:id",function(req, res){
 Meal.findByIdAndUpdate(req.params.id,req.body.Meal,function(err, meal){
  if(err){
   console.log(err);
  }else{
   console.log("update success");
   res.redirect("/meals");
  }
 });
});

app.get("/drinks/:id/edit",function(req, res){
 Drink.findById(req.params.id,function(err, drink){
  if(err){
   console.log(err);
  }else{
   res.render("editDrinks",{drink:drink});
  }
 });
});

app.put("/drinks/:id",function(req,res){
 Drink.findByIdAndUpdate(req.params.id,req.body.Drink,function(err, drink){
  if(err){
   console.log(err);
  }else{
   res.redirect("/drinks");
  }
 });
});

app.post("/confirmOrder",function(req, res){
var user = req.params.username;
 
})

app.get("/manage",function(req,res){
 Pizza.find({},function(err, pizza){
  if(err){
   console.log(err);
  }else{
   res.render("manage",{pizza:pizza});   
  }
 });
});

app.get("/manage/drink",function(req, res) {
    Drink.find({},function(err, drink){
     if(err){
      console.log(err);
     }else{
      res.render("manageDrink",{drink:drink});
     }
    });
});

app.get("/manage/meal",function(req, res) {
    Meal.find({},function(err, meal){
     if(err){
      console.log(err);
     }else{
      res.render("manageMeal",{meal:meal});
     }
    });
});

app.get("/manage/users",function(req, res) {
    User.find({},function(err,users){
     if(err){
      console.log(err);
     }else{
      res.render("Users",{Users:users});
     }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
 console.log("server is running");
});

