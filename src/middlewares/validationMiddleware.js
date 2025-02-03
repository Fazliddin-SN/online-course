import { z, ZodError } from "zod";

export const validateData = (schema) => {
  return (req, res, next) => {
    try {
      // parse body request
      schema.parse(req.body);
      next();
    } catch (error) {
      // check if error instance of zod
      if (error instanceof ZodError) {
        // find the issue and show the file path the erro occured
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json({ error: "Invalid data", details: errorMessages });
      } else {
        // if other error occurs
        res.status(500).json({ error: "Internal server Error" });
      }
    }
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}, `,
        }));
        res
          .status(400)
          .json({ error: "Invalid params", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
};

export function validateQuerry(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}, `,
        }));

        res
          .status(400)
          .json({ error: "Invalid params", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}
