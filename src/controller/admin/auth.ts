import { Request, Response } from "express";
import { AdminModel } from "../../models/shema/auth/Admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../Errors";
import { SuccessResponse } from "../../utils/response";
import { generateToken } from "../../utils/auth";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new UnauthorizedError("Email and password are required");
  }

  const admin = await AdminModel.findOne({ email });
  if (!admin) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.hashedPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = generateToken({
    id: admin.id,
    name: admin.name,
    role: "admin",
  });

  SuccessResponse(res, { message: "login Successful", token: token }, 200);

};
