const User = require("./../models/user.model");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const isAuth = require("./../middleware/isAuthenticated");
const Workout = require("./../models/workout.model")
 // You should store this in an environment variable
const SALT = 12
// Signup Route
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password, email, image, age, weight, height } = req.body;

    if (!username || !password || !email || !age || !weight || !height) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: "Username or email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
      email,
      image,
      age,
      weight,
      height,
    });

    res.status(201).json({
      message: `Created user ${createdUser.username} with id ${createdUser._id}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const correctPassword = bcrypt.compare(password, foundUser.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = { id: foundUser._id };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
      algorithm: "HS256",
    });

    res.json({
      accesstoken: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/dashboard",isAuth
  , async (req, res, next) => {
  try {
    const userID = req.userId;
    console.log(userID);
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const currentDateFormatted = new Date();
    console.log(currentDateFormatted);

    const startDay = new Date(
      currentDateFormatted.getFullYear(),
      
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );

    const endDay = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    const totalCalories = await Workout.aggregate([
      { $match: { creator: user._id, date: { $gte: startDay, $lt: endDay } } },
      { $group: { _id: null, totalCaloriesBurnt: { $sum: "$caloriesBurned" } ,workoutList:{$push:"$title"}} }
    ]);
  
    
    const totalCaloriesBurnt = totalCalories.length > 0 ? totalCalories[0].totalCaloriesBurnt : 0;
    const workoutList= totalCalories.length>0 ? totalCalories[0].workoutList:[]

    const totalWorkouts= await Workout.countDocuments({creator:userID,date:{$gte:startDay,$lt:endDay}})
    console.log(totalWorkouts,totalCaloriesBurnt)
    res.json({ user, totalCaloriesBurnt, totalWorkouts, workoutList});
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

router.put("/dashboard",isAuth, async(req,res,next)=>{
  try {
    const userID = req.userId
    const {weight, height, age} = req.body
    const updateUser = await User.findOneAndUpdate({_id:userID},{weight,height,age},{new:true})
    res.json(updateUser)
  } catch (error) {
    console.log(error)
  }
})

router.delete("/dashboard",isAuth,async(req,res,next)=>{
  try {
    console.log(req.userId)
    const deleteUser= await User.findOneAndDelete({creator:req.userId})
    const foundUser=await User.find({_id:req.userId})
    if(!foundUser){
      await Workout.findOneAndDelete({creator:req.userId})
    }
    res.json({message:"deleted"})
  } catch (error) {
    
  }
})

module.exports = router;
