const User = require("./../models/user.model");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const isAuth = require("./../middleware/isAuthenticated");
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

router.get("/verify", isAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
