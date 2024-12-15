import { Request, Response } from "express";
import { User } from "../models/user-model.js";
import { Role } from "../models/role-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  static async createUser(req: Request, res: Response): Promise<any> {
    try {
      const { login, email, password, roleId } = req.body;
      if (!login || !email || !password || !roleId)
        return res
          .status(400)
          .json({ message: "Вы должны заполнить все поля" });
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        login,
        email,
        password: hashedPassword,
        roleId,
      });
      res.status(201).json(user);
    } catch (error) {
      console.error("При создании пользователей , произошла ошибка:", error);
      res
        .status(500)
        .json({ message: "Не удалось создать пользователя.", error });
    }
  }
  static async getUsers(req: Request, res: Response): Promise<any> {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Role,
            as: "Role",
            attributes: ["id", "name"],
          },
        ],
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Ошибка при получении пользовательских данных:", error);
      res
        .status(500)
        .json({ message: "Не удалось получить пользователя", error });
    }
  }
  static async getUserById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: "Role",
            attributes: ["id", "name"],
          },
        ],
      });
      if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
      res.status(200).json(user);
    } catch (error) {
      console.error("Ошибка при получении пользовательских данных:", error);
      res
        .status(500)
        .json({ message: "Не удалось получить пользователя", error });
    }
  }
  static async updateUser(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      var { login, email, password, roleId } = req.body;
      const user = await User.findByPk(id);
      if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
      const saltRounds = 10;
      password = await bcrypt.hash(password, saltRounds);
      await user.update({ login, email, password, roleId });
      res.status(200).json(user);
    } catch (error) {
      console.error("Ошибка при обновлении данных пользователя:", error);
      res
        .status(500)
        .json({ message: "Не удалось обновить пользователя", error });
    }
  }
  static async deleteUser(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
      await user.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      res
        .status(500)
        .json({ message: "Не удалось удалить пользователя.", error });
    }
  }
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ where: { login } });
      if (!user)
        return res.status(400).json({ message: "Пользователь не найден" });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(400).json({ message: "Неверный пароль" });
      const token = jwt.sign(
        { id: user.id, login: user.login, roleId: user.roleId },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Авторизация прошла успешно", token });
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      res
        .status(500)
        .json({ message: "Не удалось авторизовать пользователя", error });
    }
  }
}
