import { Course, User, Coach } from "../models/index.js";
import { appError } from "../utils/customError.js";

export const courseControllers = {
  // MAKE A NEW COURSE
  async create(req, res, next) {
    try {
      const {
        title,
        description,
        agelimit,
        subject,
        duration,
        startDate,
        price,
        level,
      } = req.body;

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
        price: price,
        level: level,
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
  // FETCH ALL COURSES
  async fetchAllCourse(req, res, next) {
    try {
      const query = req.query;
      const limit = query.limit;
      const page = query.page;
      // calculate the offset based on page number and limit
      const offset = (page - 1) * limit;
      // fetched courses
      const courses = await Course.find().skip(offset).limit(limit);
      // make courses array is not empty
      if (!courses) {
        throw new appError("Can not fetch courses!", 404);
      }

      // prepare the result to send
      const response = {
        totalResults: courses.length,
        courses: courses.map((course) => ({
          title: course.title,
          description: course.description,
          agelimit: course.agelimit,
          subject: course.subject,
          duration: course.duration,
          startDate: course.startDate,
          price: course.price,
          level: course.level,
          students: course.students,
          reviews: course.reviews,
          rate: course.rate,
          coaches: course.coaches,
        })),
      };
      res.status(200).json({
        courses: response,
      });
    } catch (error) {
      next(error);
    }
  },
  // UPDATE COURSE ALL DETAILS
  async updateCourse(req, res, next) {
    try {
      const { courseId } = req.params;

      const {
        title,
        description,
        agelimit,
        subject,
        duration,
        startDate,
        price,
        level,
        coaches,
      } = req.body;

      // find and update found course
      const updatedcourse = await Course.findByIdAndUpdate(courseId, {
        title: title,
        description: description,
        duration: duration,
        agelimit: agelimit,
        subject: subject,
        startDate: startDate,
        price: price,
        students: [],
        reviews: [],
        levelFor: level,
        coaches: coaches,
      });

      // console.log("updated: ", updatedcourse);
      // make sure course is updated
      if (!updatedcourse) {
        throw new appError("Can not update the course!", 404);
      }

      res.status(200).json({
        message: "Course is updated!",
        request: {
          type: "PUT",
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE COURSE AND REMOVE STUDENTS ENROLLED TO THIS COURSE
  async delete(req, res, next) {
    try {
      const { courseId } = req.params;
      // fetch course by title
      const course = await Course.findById(courseId);
      // console.log("course: ", course);

      if (!course) {
        throw new appError(
          "Can not find a course with this title " + courseId,
          404
        );
      }
      // if course is removed, remove all student's enrolled to this cours
      const students = course.students;
      // console.log("Students: ", students);
      students.forEach(async (studentId) => {
        const user = await User.findByIdAndUpdate(studentId, {
          $pull: { enrollments: courseId },
        });
        if (!user) {
          throw new appError(
            "Can not remove course link from studen's enrollments",
            404
          );
        }
      });
      // delete course process
      await Course.findByIdAndDelete(courseId)
        .then(() => {
          res.status(200).json({
            message: "Course deleted successfully!",
            request: {
              type: "Delete",
            },
          });
        })
        .catch(() => {
          throw new appError("Can not delete the course!", 404);
        });
    } catch (error) {
      next(error);
    }
  },

  // ASSIGN STUDENTS TO THE COURSE
  async assignStudents(req, res, next) {
    try {
      const body = req.body;
      // make sure body is provided
      if (!body || !body.courseId || !body.studentId) {
        throw new appError(
          "Course ID and student information should be provided!",
          400
        );
      }

      // make sure the student can not enroll one course twice
      const course = await Course.findById(body.courseId);
      const students = course.students;
      students.forEach((studentId) => {
        if (studentId === body.studentId) {
          throw new appError(
            `This student has already enrolled to the ${course.title} course.`,
            400
          );
        }
      });

      const user = await User.findById(body.studentId);
      if (!user) {
        throw new appError(
          "Can not find student with this id" + body.studentId
        );
      }

      // Update the course document by
      const updatedCourse = await Course.findByIdAndUpdate(
        body.courseId,
        { $addToSet: { students: body.studentId } }, // Push the student into the students array
        { new: true } // Return the updated document
      ).populate("students", "username email ");

      if (!updatedCourse) {
        throw new appError("Course not found", 404);
      }

      // add new course user enrollments
      const updateUser = await User.findByIdAndUpdate(
        body.studentId,
        {
          $addToSet: { enrollments: body.courseId },
        },
        { new: true }
      ).populate("enrollments", "title");

      // check if user updated
      if (!updateUser) {
        throw new appError("Can not update the User ", 400);
      }
      // Send the response
      res.status(200).json({
        message: "Student added successfully",
        student: updateUser,
        course: updatedCourse, // Optionally, you can send the updated course as part of the response
        type: "PUT",
      });
    } catch (error) {
      next(error);
    }
  },

  // ASSING COACHES TO THE COURSES
  async assignCoaches(req, res, next) {
    try {
      const { courseId, coachId } = req.body;

      if (!courseId || !coachId) {
        throw new appError("course id and coach id must be provided!", 400); // needed details check
      }

      // make sure one coach can not be assigned one course twice
      const course = await Course.findById(courseId);
      course.coaches.forEach((coachid) => {
        if (coachid === coachId) {
          throw new appError(
            "This coach has already been assigned to this course!",
            400
          );
        }
      });
      //check coach existence
      const coachUpdate = await Coach.findByIdAndUpdate(
        coachId,
        {
          $addToSet: { hasCourse: courseId },
        },
        { new: true }
      ).populate("hasCourse", "_id, title");

      if (!coachUpdate) {
        throw new appError("Can not update coach model!", 404);
      }

      // update the course and add new coach
      const updateCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          $addToSet: { coaches: coachId },
        },
        { new: true }
      ).populate("coaches", "username email");

      if (!updateCourse) {
        throw new appError(
          `Can not assign the coach with name ${coachUpdate.fullname} to the course with title ${course.title}`,
          404
        );
      }

      res.status(200).json({
        message: "New coach is assigned with name " + coachUpdate.username,
        coach: updateCourse,
        coachUpdate: coachUpdate,
        request: {
          type: "PUT",
        },
      });
    } catch (error) {
      next(error);
    }
  },
  // GET COURSE DESCRIPTION
  async getDescription(req, res, next) {
    try {
      const { title } = req.query;
      const course = await Course.find({ title: title });

      if (!course) {
        throw new appError("Can not find any info about this course!", 404);
      }
      res.status(200).json({
        message: "Course details here!",
        course: course,
        request: {
          type: "GEt",
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
