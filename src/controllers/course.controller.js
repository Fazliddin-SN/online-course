import { response } from "express";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import { appError } from "../utils/customError.js";

export const courseControllers = {
  async creare(req, res, next) {
    try {
      const { title, description, agelimit, subject, duration, startDate } =
        req.body;

      // make sure each course has unique title
      const courses = await Course.find();
      courses.map((course) => {
        if (course.title === title) {
          throw new appError("Course title should be unique!", 400);
        }
      });

      // create a new course
      const newCourse = new Course({
        title: title,
        description: description,
        agelimit: agelimit,
        subject: subject,
        duration: duration,
        startDate: startDate,
      });
      // save
      newCourse.save().then((response) => {
        console.log("response: ", response);

        res.status(201).json({
          message: "Course is created!",
          request: {
            type: "POST",
            url: "http://localhost:7009/api/auth/",
          },
        });
      });
    } catch (error) {
      next(error);
    }
  },
  async updateCourse(req, res, next) {
    try {
      const body = req.body;

      // make sure body exists
      if (!body) {
        throw new appError("additional properties should be provided!", 400);
      }
      // find and update found course
      await Course.findByIdAndUpdate(body.id, {
        $set: { duration: body.duration },
      })
        .then((respone) => {
          res.status(200).json({
            message: "Course updated",
            response: {
              type: "UPDATE",
              url: "http://localhost:7009/api/auth/course/update",
            },
          });
        })
        .catch((err) => {
          throw new appError("cannot update", 400);
        });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { title } = req.query;

      await Course.deleteOne({ title: title })
        .then((response) => {
          res.status(200).json({
            message: "Course deleted",
            response: {
              type: "DELETE",
              url: "http://localhost:7009/api/auth/course/update",
            },
          });
        })
        .catch((err) => {
          throw new appError("cannot delete", 400);
        });
    } catch (error) {
      next(error);
    }
  },
  async assignStudents(req, res, next) {
    try {
      const body = req.body;
      // make sure body is provided
      if (!body || !body.id || !body.student) {
        throw new appError(
          "Course ID and student information should be provided!",
          400
        );
      }

      // Update the course document by pushing the student to the 'students' array
      const updatedCourse = await Course.findByIdAndUpdate(
        body.id,
        { $push: { students: body.student } }, // Push the student into the students array
        { new: true } // Return the updated document
      );

      if (!updatedCourse) {
        throw new appError("Course not found", 404);
      }

      // Send the response
      res.status(200).json({
        message: "Student added successfully",
        course: updatedCourse, // Optionally, you can send the updated course as part of the response
        type: "PUT",
      });
    } catch (error) {
      next(error);
    }
  },
};
