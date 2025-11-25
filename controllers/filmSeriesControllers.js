// controllers/filmSeriesController.js

const { FilmSeries } = require('../models');

//----- CREATE: POST/api/filmseries

async function createFilm(req, res) {
    try {
        const {
        genre_id,
        film_series_title,
        category,
        images,
        release_year,
        age_rating,
        description,
        cast,
        director,
        total_episodes,
        rating,
        is_premium,
        } = req.body;

        // Validation for id genre and title 
        if (!genre_id || !film_series_title) {
            return res.status(400).json({
                status: "fail",
                message: "genre_id dan film_series_title wajib diisi",
            });
        }
        
        const newFilm = await FilmSeries.create({
        genre_id,
        film_series_title,
        category,
        images,
        release_year,
        age_rating,
        description,
        cast,
        director,
        total_episodes,
        rating,
        is_premium,
        });

        return res.status(201).json({
            status: "success",
            message: "Film/Series berhasil dibuat",
            data: newFilm,
            });

    } catch (err) {
        
        console.error("[CREATE FILM ERROR]", err);
        return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        });
    }
}

//----- READ ALL: GET /api/films
async function getAllFilms(req, res) {
  try {
    const films = await FilmSeries.findAll();

    return res.status(200).json({
      status: "success",
      message: "Daftar Film/Series",
      data: films,
    });
  } catch (err) {
    console.error("[GET ALL FILM ERROR]", err);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
}

//----- READ BY ID: GET /api/films/:id
async function getFilmById(req, res) {
  try {
    const { id } = req.params;

    const film = await FilmSeries.findByPk(id);

    if (!film) {
      return res.status(404).json({
        status: "fail",
        message: "Film/Series tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Detail Film/Series",
      data: film,
    });
  } catch (err) {
    console.error("[GET FILM BY ID ERROR]", err);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
}

// PATCH /api/films/:id
async function updateFilm(req, res) {
  try {
    const { id } = req.params;

    const film = await FilmSeries.findByPk(id);

    if (!film) {
      return res.status(404).json({
        status: "fail",
        message: "Film/Series tidak ditemukan",
      });
    }

    // Only update fields that exist in req.body
    await film.update(req.body);

    return res.status(200).json({
      status: "success",
      message: "Film/Series berhasil diupdate",
      data: film,
    });
  } catch (err) {
    console.error("[PATCH FILM ERROR]", err);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
}


// DELETE: DELETE /api/films/:id
async function deleteFilm(req, res) {
  try {
    const { id } = req.params;

    const film = await FilmSeries.findByPk(id);

    if (!film) {
      return res.status(404).json({
        status: "fail",
        message: "Film/Series tidak ditemukan",
      });
    }

    await film.destroy();

    return res.status(200).json({
      status: "success",
      message: "Film/Series berhasil dihapus",
    });
  } catch (err) {
    console.error("[DELETE FILM ERROR]", err);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
}

module.exports = {
  createFilm,
  getAllFilms,
  getFilmById,
  updateFilm,
  deleteFilm,
};
