import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { hash, compare } from "bcrypt";
import { User, Course } from "../models/index.js";

import { appError } from "../utils/customError.js";

export const authControllers = {
  // USER REGISTRATION PROCCESS
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
  //USER LOGIN PROCCESS
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

      // console.log("user password");
      // console.log("enteredd password", user[0].password);

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
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
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
  // ACCESS PROFILE
  async profile(req, res, next) {
    try {
      // get user and check if user exists
      const user = await User.findById(req.user.id).select("-password");
      // make sure user exits
      if (!user) {
        throw new appError("User not found", 404);
      }

      res.status(200).json({
        userInfo: user,
        request: {
          type: "GET",
        },
      });
    } catch (error) {
      next(error);
    }
  },
  // GET ALL USERS DETAILS
  async fetchAllUsers(req, res, next) {
    try {
      const query = req.query;
      let limit = query.limit;
      let page = query.page;
      // calculate the offset based on page number and limit
      const offset = (page - 1) * limit;
      // Retrieve users
      const users = await User.find().skip(offset).limit(limit);
      // .select(("-password"));
      if (!users) {
        throw new appError("Can not fetch users!", 404);
      }
      // prepare the response object
      const reponse = {
        totalResults: users.length,
        users: users.map((user) => ({
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          phonenumber: user.phonenumber,
          email: user.email,
          location: user.location,
          role: user.role,
          age: user.age,
        })),
      };

      res.status(200).json({
        message: reponse,
        request: {
          method: "GET",
        },
      });
    } catch (error) {
      next(error);
    }
  },
  // USER UPDATE
  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const {
        username,
        password,
        location,
        fullname,
        age,
        phonenumber,
        role,
        email,
      } = req.body;

      // hash the password
      const hashedPassword = await hash(password, 10);
      // update user
      const updatedUser = await User.findByIdAndUpdate(userId, {
        username: username,
        fullname: fullname,
        email: email,
        age: age,
        password: hashedPassword,
        location: location,
        phonenumber: phonenumber,
        role: role,
        enrollments: [],
      });

      if (!updatedUser) {
        throw new appError("Can not update user info!", 404);
      }

      res.status(200).json({
        message: "User updated!",
        updatedUser: updatedUser,
        request: {
          method: "PUT",
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

      // make sure id is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new appError("Invalid user id", 400);
      }

      // courses information
      const user = await User.findById(userId);
      // remove user from courses
      const enrolledCourses = user.enrollments;
      enrolledCourses.forEach(async (courseLink) => {
        const course = await Course.findByIdAndUpdate(courseLink, {
          $pull: { students: userId },
        });
        if (!course) {
          throw new appError("Can not remove this user from courses", 400);
        }
      });

      await User.deleteOne({ _id: userId })
        .exec()
        .then(() => {
          console.log("user deleted");
          res.status(200).json({
            message: "user deleted and course updated",
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
  // GET USER DETAILS HERE
  async findUser(req, res, next) {
    try {
      const { userId } = req.params;
      // find user by id

      if (!userId) {
        throw new appError("you should provide user Id!", 400);
      }
      // make sure id is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new appError("Invalid user id", 403);
      }

      const user = await User.findById(userId).select("-password");
      // make sure user exists
      if (!user) {
        throw new appError("User not found!", 404);
      }

      res.status(200).json({
        user: user,
        request: {
          type: "GET",
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
