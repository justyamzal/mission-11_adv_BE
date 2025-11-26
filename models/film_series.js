// models/film_series.js

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class filmSeries extends Model {
        static associate(models) {
           //to do : if next want to add model Genre/Episode_Movie 
        }
    }

    filmSeries.init(
    {
      film_series_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      film_series_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(20),
      },
      images: {
        type: DataTypes.STRING,
      },
      release_year: {
        type: DataTypes.INTEGER,
      },
      age_rating: {
        type: DataTypes.STRING(10),
      },
      description: {
        type: DataTypes.TEXT,
      },
      cast: {
        type: DataTypes.TEXT,
      },
      director: {
        type: DataTypes.STRING(100),
      },
      total_episodes: {
        type: DataTypes.INTEGER,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 1),
      },
      is_premium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "filmSeries",      // nama model di Sequelize
      tableName: "Film_Series",     // nama tabel di MySQL
      timestamps: false,
    }
  );

  return filmSeries;
};




