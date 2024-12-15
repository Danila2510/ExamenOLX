import { Request, Response } from "express";
import { Product } from "../models/product-model.js";
import { Op } from "sequelize";

export class ProductController {
  static async createProduct(req: Request, res: Response): Promise<any> {
    try {
      const { title, description, category, price, photos } = req.body;
      if (!title || !description || !category || !price)
        return res.status(400).json({ message: "Заполните все поля" });
      const product = await Product.create({
        title,
        description,
        category,
        price,
        photos,
      });
      res.status(201).json(product);
    } catch (error) {
      console.error("Ошибка при создании продукт:", error);
      res
        .status(500)
        .json({ message: "Не получилось создать продукт:", error });
    }
  }

  static async getProducts(req: Request, res: Response): Promise<any> {
    try {
      const ads = await Product.findAll();
      res.status(200).json(ads);
    } catch (error) {
      console.error("Ошибка при получении продукта:", error);
      res.status(500).json({ message: "Не удалось получить продукты", error });
    }
  }

  static async getProductById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product)
        return res.status(404).json({ message: "Продукт не найден" });
      res.status(200).json(product);
    } catch (error) {
      console.error("Ошибка получения продуктов:", error);
      res.status(500).json({ message: "Не удалось получить продукты", error });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { title, description, category, price, photos } = req.body;
      const product = await Product.findByPk(id);
      if (!product)
        return res.status(404).json({ message: "Продукт не найден." });
      await product.update({ title, description, category, price, photos });
      res.status(200).json(product);
    } catch (error) {
      console.error("Ошибка обновления продукта", error);
      res.status(500).json({ message: "Не удалось обновить продукт.", error });
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product)
        return res.status(404).json({ message: "Продукт не найден:" });
      await product.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Ошибка удаления продукта:", error);
      res.status(500).json({ message: "Не удалось удалить продукт", error });
    }
  }

  static async searchProducts(req: Request, res: Response): Promise<any> {
    try {
      const { title, category, minPrice, maxPrice } = req.query;
      const whereConditions = [];
      if (title) whereConditions.push({ title: { [Op.like]: `%${title}%` } });
      if (category)
        whereConditions.push({ category: { [Op.like]: `%${category}%` } });
      if (minPrice)
        whereConditions.push({ price: { [Op.gte]: Number(minPrice) } });
      if (maxPrice)
        whereConditions.push({ price: { [Op.lte]: Number(maxPrice) } });
      const ads = await Product.findAll({
        where: {
          [Op.and]: whereConditions,
        },
      });
      if (ads.length === 0)
        return res.status(404).json({ message: "Продукт не найден" });
      res.status(200).json(ads);
    } catch (error) {
      console.error("Ошибка при поиске продукта:", error);
      res.status(500).json({ message: "Не удалось найти продукт", error });
    }
  }
}
