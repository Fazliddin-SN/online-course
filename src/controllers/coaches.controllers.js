import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Coach } from "../models/index.js";
import { appError } from "../utils/customError.js";

export const coachesController = {
  async registerCoach(req, res, next) {
    try {
      const body = req.body;
      console.log("Body pas", body.password);

      // hash the password
      const hashedPassword = await hash(body.password, 10);
      console.log("passowrd", hashedPassword);

      // implement details and register new coach
      const newCoach = new Coach({
        username: body.username,
        fullname: body.fullname,
        phonenumber: body.phonenumber,
        email: body.email,
        password: hashedPassword,
        experience: body.experience,
        expertise: body.expertise,
        role: body.role,
        levelFor: body.levelFor,
      });

      // save new coach to the server
      await newCoach
        .save()
        .then(() => {
          res.status(201).json({
            message: `A new Coach registered with username ${body.fullname}`,
            request: {
              type: "POST",
            },
          });
        })
        .catch((err) => {
          throw new appError("Can not register a new coach", err, 400);
        });
    } catch (error) {
      next(error);
    }
  },

  // COACH LOGIN PROCCESS!
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      // make sure needed info provided
      if (!username || !password) {
        throw new appError("Username and password are required!", 400);
      }

      // find coach by username
      const coach = await Coach.find({ username });
      if (!coach) {
        throw new appError(
          `Cannot find a coach with username ${username}`, // make coach exists with entered user name
          404
        );
      }
      // match passwords
      const isMatch = await compare(password, coach[0].password);

      if (!isMatch) {
        throw new appError("Invalid credentials!", 401);
      }

      if (!process.env.JWT_SECRET) {
        throw new appError("JWT secret is missing!", 500);
      }
      // sign new token to coach
      const token = jwt.sign(
        // provide two properties id and role
        { id: coach[0]._id, role: coach[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );
      // check token existence
      if (!token) {
        throw new appError("Failed to generate authentication token!", 400);
      }

      res.status(200).json({
        message: "Token is successfully generated",
        token: token,
        requst: {
          type: "POST",
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
