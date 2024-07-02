const { Schema, model } = require("mongoose");

const workoutSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    sets: {
      type: Number,
      min: 1,
      require: true,
    },
    reps: {
      type: Number,
      min: 1,
      require: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Workout = model("Workout", workoutSchema);
module.exports = Workout;
