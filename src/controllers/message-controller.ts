import { Request, Response } from "express";
import Message from "../models/message-model.js";
import { Op } from "sequelize";

export default class MessageController {
  static async sendMessage(req: Request, res: Response): Promise<any> {
    try {
      const { senderId, recipientId, productId, content } = req.body;
      if (!senderId || !recipientId || !productId || !content)
        return res
          .status(400)
          .json({ message: "Обязательные поля должны быть заполнены." });
      const message = await Message.create({
        senderId,
        recipientId,
        productId,
        content,
      });
      res
        .status(201)
        .json({ message: "Сообщение было  отправлено.", data: message });
    } catch (error) {
      console.error("Ошибка при отправке сообщение.", error);
      res
        .status(500)
        .json({ message: "Не удалось отправить сообщение. ", error });
    }
  }

  static async getMessages(req: Request, res: Response): Promise<any> {
    try {
      const { userId, chatPartnerId, productId } = req.query;

      if (!userId || !chatPartnerId || !productId)
        return res
          .status(400)
          .json({ message: "userId, chatPartnerId and productId required" });
      const adIdNumber = parseInt(productId as string, 10);
      const userIdString = userId as string;
      const chatPartnerIdString = chatPartnerId as string;
      if (isNaN(adIdNumber))
        return res
          .status(400)
          .json({ message: "productId обязан быть числовым типом." });
      const messages = await Message.findAll({
        where: {
          productId: adIdNumber,
          [Op.or]: [
            { senderId: userIdString, recipientId: chatPartnerIdString },
            { senderId: chatPartnerIdString, recipientId: userIdString },
          ],
        },
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json({ messages });
    } catch (error) {
      console.error("Ошибка при получении сообщения.", error);
      res
        .status(500)
        .json({ message: "Ошибка , не удалось получить сообщение.", error });
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<any> {
    try {
      const { messageId } = req.params;
      const message = await Message.findByPk(messageId);
      if (!message)
        return res.status(404).json({ message: "Сообщение не найдено" });
      message.isRead = true;
      await message.save();
      res.status(200).json({ message: "Сообщение является как прочитано" });
    } catch (error) {
      console.error(
        "При обновлении статуса сообщения , произошла ошибка.",
        error
      );
      res
        .status(500)
        .json({ message: "Обновить статус сообщение , не удалось. ", error });
    }
  }
}
