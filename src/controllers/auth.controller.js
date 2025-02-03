import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { hash, compare } from "bcrypt";
import { User } from "../models/User.js";
import { appError } from "../utils/customError.js";

export const authControllers = {
  async register(req, res, next) {
    try {
      const body = req.body;
      // make sure body provided
      if (!body) {
        throw new appError("All required info must be provided!", 400);
      }
      // hash the user password
      const hashedPassword = await hash(body.password, 10);
      // fill all the reuqired info
      const newUser = new User({
        username: body.username,
        fullname: body.fullname,
        password: hashedPassword,
        email: body.email,
        phonenumber: body.phonenumber,
        role: body.role,
        location: body.location,
        age: body.age,
      });
      // save user to database
      await newUser
        .save()
        .then((response) => {
          console.log("user added");
        })
        .catch((err) => {
          console.error("Error: ", err);
        });

      res
        .status(201)
        .json({ message: `User registered with username ${body.username}` });
    } catch (error) {
      next(error);
    }
  },
  //user login proccess
  async login(req, res, next) {
    try {
      //extract username and password
      const { username, password } = req.body;
      // find user by user name
      const user = await User.find({ username });
      // make sure user exists
      console.log("user: ", user);

      if (!user) {
        throw new appError(`User with username ${username} not found!`, 404);
      }

      console.log("user password");
      console.log("enteredd password", user[0].password);

      // compare entered pass with found password
      const isMatch = await compare(password, user[0].password);

      // make sure password matches
      if (!isMatch) {
        throw new appError("Invalid credentials ", 400);
      }

      // create token for each user
      const token = jwt.sign(
        // provide two properties id and role
        { id: user[0]._id, role: user[0].role },
        // token is created accordingly
        process.env.JWT_SECRET
      );
      // provide token for user
      res.status(200).json({
        token: token,
        userInfo: user,
      });
    } catch (error) {
      next(error);
    }
  },
  // access profile
  async profile(req, res, next) {
    try {
      const query = req.query;
      // get query params
      if (!query.username || !query.password) {
        throw new appError("Username and password are required", 400);
      }
      // get user and check if user exists
      const user = await User.find({ username: query.username });
      //
      if (!user) {
        throw new appError("User not found", 404);
      }
      // check password matches
      const isMatch = compare(query.password, user.password);
      if (!isMatch) {
        throw new CustomError(`invalid credentials`, 400);
      }
      res.status(200).json({
        userInfo: user,
        request: {
          type: "GET",
          body: { user: user },
        },
      });
    } catch (error) {
      next(error);
    }
  },
  // delete user
  async delete(req, res, next) {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new appError("Invalid user id", 400);
      }

      await User.deleteOne({ _id: userId })
        .exec()
        .then((result) => {
          console.log("user deleted");
          res.status(200).json({
            message: "user deleted",
            request: {
              type: "DELETE",
              url: "http://localhost:7002/api/users/delete",
              body: { userId: "ID" },
            },
          });
        });
    } catch (error) {
      next(error);
    }
  },
  async findUser(req, res, next) {
    try {
      const { userId } = req.params;
      // find user by id
      const user = await User.findById({ _id: userId });
      // make sure user exists
      if (!user) {
        throw new appError("User not found!", 404);
      }

      res.status(200).json({
        user: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
