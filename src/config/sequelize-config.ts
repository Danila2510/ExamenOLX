import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    dialect: "mysql",
    logging: false,
  }
);

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Соединение готово.");
  } catch (error) {
    console.error("Соединить не удалось к базе данных.", error);
  }
};
export const syncDb = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("База данных синхронизирована");
  } catch (error) {
    console.error("База данных не синхронизирована", error);
  }
};
