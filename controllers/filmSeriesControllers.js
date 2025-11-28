// controllers/filmSeriesController.js

const { filmSeries } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

//----- Helper: hapus file kalau ada di disk
function deleteFileIfExists(filePath) {
  if (!filePath) return;

  const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.join(process.cwd(), relativePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.warn('Gagal menghapus file:', fullPath, err.message);
    } else {
      console.log('File dihapus:', fullPath);
    }
  });
}
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
        
        // --- LOGIC FOR OPTIONAL IMAGE ---
        // default: ambil dari body (kalau ada), atau null
        let imagePath = images || null;
        // kalau ada file upload dari multer, override pakai itu
        if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
        }

        const newFilm = await filmSeries.create({
        genre_id,
        film_series_title,
        category,
        images: imagePath,
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
    const {
        genre_id,
        category,
        is_premium,
        min_rating,
        max_rating,
        year,
        search,
        age_rating,
        //sorting
        sort_by,    //ex: release_year, rating, film_series_title
        sort_order,
        //pagination
        page = 1,
        limit = 10,
    } = req.query;

    //----- FILTERING 
    const where = {};
    if (genre_id) {
        where.genre_id = genre_id;
    }

    if (category) {
        where.category = category;
    }

    if (is_premium !== undefined) {
        where.is_premium = is_premium;
    }

    if (year) {
      where.release_year = year;
    }

    if (age_rating) {
      where.age_rating = age_rating; // "13+" / "18+" dll
    }

    if (min_rating || max_rating) {
      where.rating = {};
      if (min_rating) where.rating[Op.gte] = Number(min_rating);
      if (max_rating) where.rating[Op.lte] = Number(max_rating);
    }

    if (search) {
      // cari di title / description
      where[Op.or] = [
        { film_series_title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    
    //----- SORTING
    let order = [['createdAt', 'DESC']]; // default

    if (sort_by) {
      // batasi field yang boleh di-sort (biar aman)
      const allowedSortFields = ['release_year', 'rating', 'film_series_title', 'createdAt'];
      const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'createdAt';

      let sortDirection = 'DESC';
      if (sort_order && ['asc', 'ASC'].includes(sort_order)) {
        sortDirection = 'ASC';
      }

      order = [[sortField, sortDirection]];
    }

    //----- PAGINATION
    const pageNum = parseInt(page,10) || 1;
    const limitNum = parseInt(limit,10) || 10;
    const offset = (pageNum - 1) * limitNum;

    //----- QUERY ke DB ---
    const { rows, count } = await filmSeries.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
    });

    return res.status(200).json({
      status: "success",
      message: "Daftar Film/Series",
      data: rows,
      pagination: {
        totalData: count,
        page: pageNum,
        limit: limitNum,
        totalPage: Math.ceil(count / limitNum),
      },
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

    const film = await filmSeries.findByPk(id);

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

//----- PATCH /api/films/:id
async function updateFilm(req, res) {
  try {
        const { id } = req.params;

        const film = await filmSeries.findByPk(id);

        if (!film) {
        return res.status(404).json({
            status: "fail",
            message: "Film/Series tidak ditemukan",
        });
        }
        // simpan path image lama
        const oldImagePath = film.images;
        // siapkan data update dari body
        const updateData = { ...req.body };
        // kalau ada file baru, override kolom images
        if (req.file) {
        updateData.images = `/uploads/${req.file.filename}`;
        }
        // Only update fields that exist in req.body / file
        await film.update(updateData);

        // kalau ada image baru dan ada image lama, hapus file lama
        if (req.file && oldImagePath && oldImagePath !== film.images) {
        deleteFileIfExists(oldImagePath);
        }


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
//----- DELETE: DELETE /api/films/:id
async function deleteFilm(req, res) {
  try {
        const { id } = req.params;

        const film = await filmSeries.findByPk(id);

        if (!film) {
        return res.status(404).json({
            status: "fail",
            message: "Film/Series tidak ditemukan",
        });
        }

        const imagePath = film.images;

        await film.destroy();

        // hapus file image kalau ada
        if (imagePath) {
        deleteFileIfExists(imagePath);
        }

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
