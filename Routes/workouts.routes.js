const router = require("express").Router();
const axios = require("axios");
const isAuth = require("./../middleware/isAuthenticated");
const Workout = require("./../models/workout.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User= require("./../models/user.model")
const API_NINJAS_KEY = "FRkT0SVi6Nq93HepoRjtYA==LWV7tpkNwsy6oT2l";

router.get("/:id/workoutlist", isAuth, async (req, res, next) => {
  try {
    const {id}=req.params
    const findUser= await User.findOne({_id:id})
    const weightInLBS=findUser.weight*2.20462
    console.log(weightInLBS)
    const response = await axios.get(
      `https://api.api-ninjas.com/v1/caloriesburned?activity=swimming&weight=${weightInLBS}`,
      { headers: { "X-Api-Key": API_NINJAS_KEY } }
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

router.post("/create", isAuth, async (req, res, next) => {
  try {
    const { title, sets, reps, caloriesBurned } = req.body;
    const { id } = req.params;
    if (!title|| !caloriesBurned) {
      return res
        .status(400)
        .json({ message: "title and calories must required" });
    }
    const createWorkout = await Workout.create({
      creator: id,
      title,
      sets,
      reps,
      caloriesBurned,
    });
    res.status(201).json({ message: "created the workout" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userWorkout = await Workout.find({ creator: id }).populate("creator");
    console.log(userWorkout);
    res.json({ workout: userWorkout });
  } catch (error) {
    console.log(error);
  }
});

router.put("/list/:id",isAuth,async(req,res,next)=>{
  try {
    const {id}= req.params
    const {sets, reps,caloriesBurned,title}= req.body
    const workoutUpdate= await Workout.findOneAndUpdate({_id:id},{sets,reps,caloriesBurned,title},{new:true})

    res.json(workoutUpdate)
  } catch (error) {
    
  }
})

router.delete("/list/:id",isAuth,async(req,res,next)=>{
  try {
    const {id}= req.params
    const userWorkout=await Workout.findOneAndDelete({_id:id})
    res.json({message:"deleted"})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
