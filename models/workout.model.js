const { Schema, model } = require("mongoose");

const workoutSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    title: {
      type: String,
      require: true,
    },
    sets: {
      type: Number,
      min: 1,
      default: 1,
      require: true,
    },
    reps: {
      type: Number,
      min: 1,
      default: 1,
      require: true,
    },
    caloriesBurned: {
      type: Number,
      min: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Workout = model("Workout", workoutSchema);
module.exports = Workout;
