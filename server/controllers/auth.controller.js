import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.handler.js";
import jwt from "jsonwebtoken";

const signup = async (req, res, next) => {
  console.log("nithin raj");
  const { username, email, password } = req.body;

  // hashing password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = await new User({
      userName: username,
      email,
      password: hashedPassword,
    }).save();
    console.log(newUser);

    res.status(201).json("User created succesfully");
  } catch (error) {
    console.log("message", error);
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // const validUser = await User.findOne({ email });
    const validUser = await User.findOneAndUpdate(
      { email }, // Filter for finding the user
      { $set: { online: true } }, // Update to set the online field to true
      { new: true } // Return the updated document
    );

    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  try {
    // const user = await User.findOne({ email: req.body.email });
    const user = await User.findOneAndUpdate(
      { email: req.body.email }, // Filter for finding the user
      { $set: { online: true } }, // Update to set the online field to true
      { new: true } // Return the updated document
    );

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = await new User({
        userName:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      }).save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await User.findOneAndUpdate(
      { email }, // Filter for finding the user
      { $set: { online: false } }, // Update to set the online field to true
      { new: true } // Return the updated document
    );
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export { signup, signin, google, signOut };
