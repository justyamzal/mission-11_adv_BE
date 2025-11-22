-- 1. Buat database (opsional, sesuaikan namanya)
CREATE DATABASE IF NOT EXISTS chill_db_adv
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chill_db_adv;

-- 2. Tabel GENRE
CREATE TABLE `Genre` (
  genre_id     INT AUTO_INCREMENT PRIMARY KEY,
  genre_name   VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- 3. Tabel PAKET
CREATE TABLE `Paket` (
  paket_id        INT AUTO_INCREMENT PRIMARY KEY,
  paket_price     DECIMAL(10,2) NOT NULL,
  paket_features  TEXT
) ENGINE=InnoDB;

-- 4. Tabel PEMBAYARAN
CREATE TABLE `Pembayaran` (
  payment_id     INT AUTO_INCREMENT PRIMARY KEY,
  payment_method VARCHAR(50) NOT NULL,
  payment_date   DATETIME     NOT NULL,
  admin_fee      DECIMAL(10,2) DEFAULT 0,
  discount       DECIMAL(10,2) DEFAULT 0,
  total_price    DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB;

-- 5. Tabel USER
CREATE TABLE `User` (
  user_id         INT AUTO_INCREMENT PRIMARY KEY,
  fullname        VARCHAR(100),
  user_name       VARCHAR(100),
  user_email      VARCHAR(100),
  user_password   VARCHAR(255),
  profile_picture VARCHAR(255),
  status_subs     ENUM('active','inactive') DEFAULT 'inactive',
  device_type     ENUM('mobile','desktop','tablet') DEFAULT 'desktop',
  personal_rating DECIMAL(3,1),
  token           VARCHAR(100),
  verified        ENUM('pending','yes') DEFAULT 'pending'
) ENGINE=InnoDB;

-- 6. Tabel FILM_SERIES
CREATE TABLE `Film_Series` (
  film_series_id   INT AUTO_INCREMENT PRIMARY KEY,
  genre_id         INT NOT NULL,
  film_series_title VARCHAR(255) NOT NULL,
  category         VARCHAR(20),
  images           VARCHAR(255),
  release_year     INT,
  age_rating       VARCHAR(10),
  description      TEXT,
  cast             TEXT,
  director         VARCHAR(100),
  total_episodes   INT,
  rating           DECIMAL(3,1),
  is_premium       BOOLEAN DEFAULT 0,
  CONSTRAINT fk_filmseries_genre
    FOREIGN KEY (genre_id) REFERENCES `Genre`(genre_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. Tabel EPISODE_MOVIE
CREATE TABLE `Episode_Movie` (
  eps_movie_id    INT AUTO_INCREMENT PRIMARY KEY,
  series_film_id  INT NOT NULL,
  eps_title       VARCHAR(255),
  eps_description TEXT,
  duration        INT,
  eps_number      INT,
  eps_thumbnails  VARCHAR(255),
  CONSTRAINT fk_eps_series
    FOREIGN KEY (series_film_id) REFERENCES `Film_Series`(film_series_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Tabel DAFTAR_SAYA
CREATE TABLE `Daftar_Saya` (
  list_id        INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  film_series_id INT NOT NULL,
  CONSTRAINT fk_list_user
    FOREIGN KEY (user_id) REFERENCES `User`(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_list_film
    FOREIGN KEY (film_series_id) REFERENCES `Film_Series`(film_series_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Tabel ORDER (pakai backtick karena "order" adalah keyword SQL)
CREATE TABLE `Order` (
  order_id     INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  paket_id     INT NOT NULL,
  payment_id   INT NOT NULL,
  order_status VARCHAR(20),
  expired_date DATE,
  CONSTRAINT fk_order_user
    FOREIGN KEY (user_id)    REFERENCES `User`(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_order_paket
    FOREIGN KEY (paket_id)   REFERENCES `Paket`(paket_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_order_payment
    FOREIGN KEY (payment_id) REFERENCES `Pembayaran`(payment_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;
