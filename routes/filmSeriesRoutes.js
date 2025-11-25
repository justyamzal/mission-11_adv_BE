// routes/filmSeriesRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const filmController = require("../controllers/filmSeriesController");

// CREATE Film/Series  (butuh login & JWT)
router.post("/", auth, filmController.createFilm);
// READ ALL Film/Series
router.get("/", filmController.getAllFilms);
// READ DETAIL Film/Series
router.get("/:id", filmController.getFilmById);
// UPDATE Film/Series (butuh login & JWT)
router.patch("/:id", auth, filmController.updateFilm);
// DELETE Film/Series (butuh login & JWT)
router.delete("/:id", auth, filmController.deleteFilm);

module.exports = router;
