const router = require("express").Router();
const axios = require("axios");
const isAuth = require("./../middleware/isAuthenticated");
const Workout = require("./../models/workout.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const API_NINJAS_KEY = "FRkT0SVi6Nq93HepoRjtYA==LWV7tpkNwsy6oT2l";

router.get("/:id/list", isAuth, async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://api.api-ninjas.com/v1/caloriesburned?activity=swimming",
      { headers: { "X-Api-Key": API_NINJAS_KEY } }
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/create", isAuth, async (req, res, next) => {
  try {
    const { creator, title, sets, reps, caloriesBurned } = req.body;
    const { id } = req.params;
    if (!title) {
      return res
        .status(400)
        .json({ message: "title and creator must required" });
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

router.get("/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  const userWorkout = await Workout.find({ creator: id }).populate("creator");
  console.log(userWorkout);
  res.json({ workout: userWorkout });
  try {
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
