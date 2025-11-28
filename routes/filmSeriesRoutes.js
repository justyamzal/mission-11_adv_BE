// routes/filmSeriesRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const filmController = require("../controllers/filmSeriesControllers");
const upload = require("../middleware/uploadImages"); 


// CREATE Film/Series  (butuh login & JWT, image opsional)
router.post("/",auth, upload.single("image"),filmController.createFilm); // <-- kalau ada file 'image' akan diproses, kalau tidak ada ya lanjut saja
// READ ALL Film/Series
router.get("/", filmController.getAllFilms);
// READ DETAIL Film/Series
router.get("/:id", filmController.getFilmById);
// UPDATE Film/Series (butuh login & JWT)
// UPDATE Film/Series (butuh login & JWT, image opsional)
router.patch("/:id", auth, upload.single("image"), filmController.updateFilm);    // <-- opsional juga
// DELETE Film/Series (butuh login & JWT)
router.delete("/:id", auth, filmController.deleteFilm);



module.exports = router;
