import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { BadRequestError } from "../error/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
import { Password } from "../services/password";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get("/currentuser", currentUser, requireAuth, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError("Invalid credentials.");

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) throw new BadRequestError("Invalid credentials.");

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  }
);

router.post("/signout", (req: Request, res: Response) => {
  req.session = null;

  res.send({});
});

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email is already used");
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export default router;
