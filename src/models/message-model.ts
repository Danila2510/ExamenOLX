import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize-config.js';

class Message extends Model {
    public id!: number;
    public senderId!: number;
    public recipientId!: number;
    public productId!: number;
    public content!: string;
    public isRead!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recipientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
    }
);

export default Message;
