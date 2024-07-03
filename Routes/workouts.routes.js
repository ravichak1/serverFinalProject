const router = require("express").Router()

const isAuth = require("./../middleware/isAuthenticated")
const Workout = require("./../models/workout.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post("/create",async(req,res,next)=>{
    try {
        const {title,sets,reps,creator}=req.body

        if(!title||!creator){
            return res.status(400).json({message:"title and creator must required"})
        }
        const createWorkout= await Workout.create({
            title,sets,reps,creator
        })
        res.status(201).json({message:"created the workout"})
    } catch (error) {
        console.log(error)
    }
})


module.exports = router