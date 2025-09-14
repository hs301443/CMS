import { Request, Response } from 'express';
import { UserModel } from '../../models/shema/auth/User';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';
import bcrypt from 'bcrypt';
export const createUser = async (req: Request, res: Response) => {
 if(!req.user|| req.user.role !== 'admin') throw new UnauthorizedError("Access denied");
   const { name, email, password, phonenumber } = req.body;

    if (!password) {
      throw new BadRequest('Password is required');
    }

    // 🟢 تشفير الباسورد
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      phonenumber,
    });

    await user.save();

    SuccessResponse(res, { message: 'User created successfully', user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },  });
}

export const getUserById = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedError('Access denied');
  }
    const { id } = req.params;
  const user = await UserModel.findById(id).select('-password').populate('planId',"name");
  if (!user) {
    throw new NotFound('User not found');
  }
  SuccessResponse(res, { message: 'User details', user });
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedError('Access denied');
  }
  const { id } = req.params;
  const { name, email, password, phonenumber } = req.body;
  const user = await UserModel.findById(id);
  if (!user) {
    throw new NotFound('User not found');
  }
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }
  user.name = name;
  user.email = email;
  user.phonenumber = phonenumber;
  await user.save();
  SuccessResponse(res, { message: 'User updated successfully'})
};

export const deleteUser = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedError('Access denied');
  }
  const { id } = req.params;
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) {
    throw new NotFound('User not found');
  }
  SuccessResponse(res, { message: 'User deleted successfully' });
};

export const getAllUsers = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedError('Access denied');
  }
  const users = await UserModel.find().select('-password').populate('planId',"name");
  SuccessResponse(res, { message: 'Users fetched successfully', users });
};