// models/user.js (user model definition with Sequelize)

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}

    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            fullname: DataTypes.STRING,
            user_name: DataTypes.STRING,
            user_email: DataTypes.STRING,
            user_password: DataTypes.STRING,
            profile_picture: DataTypes.STRING,
            status_subs: {
                type:DataTypes.ENUM("active","inactive"),
                defaultValue:"inactive",
            },
            device_type:{
                type:DataTypes.ENUM("mobile","desktop","tablet"),
                defaultValue:"desktop",
            },
            token: DataTypes.STRING,
            verified: {
                type: DataTypes.ENUM("pending","no"),
                defaultValue: "pending",
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "User",
            timestamps: false,
        }
    );
     return User;
};

