-- ============================================================
-- Buzz Cafe — MySQL Database Schema
-- Version: 1.0 | Production Ready
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

CREATE DATABASE IF NOT EXISTS `buzz_cafe` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `buzz_cafe`;

-- -------------------------------------------------------
-- Table: admins
-- -------------------------------------------------------
CREATE TABLE `admins` (
  `id`         INT(11) NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(100) NOT NULL UNIQUE,
  `email`      VARCHAR(191) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `full_name`  VARCHAR(191) NOT NULL,
  `role`       ENUM('super_admin','admin') NOT NULL DEFAULT 'admin',
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default admin: username=admin | password=BuzzAdmin@2024
INSERT INTO `admins` (`username`,`email`,`password`,`full_name`,`role`) VALUES
('admin','admin@buzzcafe.in','$2y$12$LvWk8bGlOAOC4BSLdMPqQOvSMGO2QLH4P1W8MmBqEYFaXfYu5Cgsy','Buzz Admin','super_admin');

-- -------------------------------------------------------
-- Table: menu_categories
-- -------------------------------------------------------
CREATE TABLE `menu_categories` (
  `id`         INT(11) NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100) NOT NULL,
  `icon`       VARCHAR(100) DEFAULT '🍽️',
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `menu_categories` (`name`,`icon`,`sort_order`) VALUES
('Rolls','🌯',1),
('Quick Bites','🍟',2),
('Cold Beverages','🥤',3),
('Hot Beverages','☕',4),
('Buzz Shots','🥃',5),
('Pasta','🍝',6),
('Desserts','🍫',7),
('Mojito','🍃',8),
('Salad','🥗',9);

-- -------------------------------------------------------
-- Table: menu_items
-- -------------------------------------------------------
CREATE TABLE `menu_items` (
  `id`          INT(11) NOT NULL AUTO_INCREMENT,
  `category_id` INT(11) NOT NULL,
  `name`        VARCHAR(191) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price`       DECIMAL(10,2) NOT NULL,
  `image_url`   VARCHAR(500) DEFAULT NULL,
  `is_veg`      TINYINT(1) NOT NULL DEFAULT 1,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order`  INT(11) NOT NULL DEFAULT 0,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_menu_category` (`category_id`),
  CONSTRAINT `fk_menu_category` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Rolls
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(1,'Veg Roll',49,1,0),
(1,'Spinach Roll',69,1,0),
(1,'Paneer Roll',69,1,1),
(1,'Paneer Cheese Roll',79,1,1),
(1,'Tandoori Paneer Roll',79,1,0),
(1,'Paneer Makhani Roll',79,1,0),
(1,'Peri Peri Paneer Roll',79,1,0),
(1,'Egg Roll',49,0,0),
(1,'Chicken Roll',79,0,1),
(1,'Chicken Garlic Roll',79,0,0),
(1,'Chicken Tandoori Roll',89,0,1),
(1,'Chicken Cheese Roll',89,0,1),
(1,'BBQ Chicken Roll',89,0,0),
(1,'Chicken Makhani Roll',99,0,1);

-- Quick Bites
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(2,'Potato Cheese Shots',79,1,1),
(2,'Veg Finger Chips',79,1,0),
(2,'Cheese and Corn Pops',79,1,1),
(2,'Potato Garlic Nuggets',79,1,0),
(2,'Chicken Nuggets',119,0,1),
(2,'Chicken Crispy',139,0,1);

-- Cold Beverages
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(3,'Lemon Iced Tea',40,1,0),
(3,'Fresh Lime Water',50,1,0),
(3,'Cold Coffee',50,1,1),
(3,'Fresh Lime Soda',60,1,0),
(3,'Cold Coffee with Crush',60,1,0),
(3,'Cold Coffee with Ice Cream',70,1,1),
(3,'Chocolate Shake',70,1,1),
(3,'Mango Milk Shake',89,1,1),
(3,'Pineapple Shake',89,1,0),
(3,'Strawberry Milk Shake',89,1,0),
(3,'Kitkat Milk Shake',99,1,1),
(3,'Oreo Milk Shake',99,1,1);

-- Hot Beverages
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(4,'Black Tea',15,1,0),
(4,'Lemon Tea',20,1,0),
(4,'Hot Coffee',30,1,1),
(4,'Hot Chocolate',60,1,1),
(4,'Strawberry Hot Chocolate',80,1,1);

-- Buzz Shots
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(5,'Jamun Shots',40,1,1),
(5,'Guava Shots (Seasonal)',40,1,0);

-- Pasta
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(6,'Red Sauce Pasta',99,1,1),
(6,'White Sauce Pasta',109,1,1),
(6,'Masala Pasta',109,1,0),
(6,'Mac n Cheese Pasta',119,1,1);

-- Desserts
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(7,'Choco Lava Cake',89,1,1),
(7,'Walnut Brownie',99,1,1),
(7,'Walnut Brownie with Ice Cream',109,1,1),
(7,'Sizzling Brownie with Ice Cream',129,1,1);

-- Mojito
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(8,'Mint Mojito',79,1,1),
(8,'Blue Berry Mojito',79,1,1);

-- Salad
INSERT INTO `menu_items` (`category_id`,`name`,`price`,`is_veg`,`is_featured`) VALUES
(9,'Veg Salad',99,1,0),
(9,'Chicken Salad',119,0,0);

-- -------------------------------------------------------
-- Table: reservations
-- -------------------------------------------------------
CREATE TABLE `reservations` (
  `id`           INT(11) NOT NULL AUTO_INCREMENT,
  `name`         VARCHAR(191) NOT NULL,
  `email`        VARCHAR(191) NOT NULL,
  `phone`        VARCHAR(20) NOT NULL,
  `date`         DATE NOT NULL,
  `time`         TIME NOT NULL,
  `guests`       INT(11) NOT NULL DEFAULT 2,
  `occasion`     VARCHAR(100) DEFAULT NULL,
  `message`      TEXT DEFAULT NULL,
  `status`       ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  `admin_note`   TEXT DEFAULT NULL,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: gallery
-- -------------------------------------------------------
CREATE TABLE `gallery` (
  `id`          INT(11) NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(191) DEFAULT NULL,
  `image_url`   VARCHAR(500) NOT NULL,
  `category`    VARCHAR(100) DEFAULT 'general',
  `sort_order`  INT(11) NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `gallery` (`title`,`image_url`,`category`) VALUES
('Cafe Ambience','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800','ambience'),
('Coffee Art','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800','beverages'),
('Delicious Food','https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800','food'),
('Cozy Corner','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800','ambience'),
('Signature Drinks','https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=800','beverages'),
('Pasta Delight','https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800','food'),
('Dessert Heaven','https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800','food'),
('Evening Vibe','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800','ambience'),
('Mojito Magic','https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800','beverages');

-- -------------------------------------------------------
-- Table: testimonials
-- -------------------------------------------------------
CREATE TABLE `testimonials` (
  `id`         INT(11) NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(191) NOT NULL,
  `avatar`     VARCHAR(500) DEFAULT NULL,
  `rating`     TINYINT(1) NOT NULL DEFAULT 5,
  `review`     TEXT NOT NULL,
  `platform`   VARCHAR(50) DEFAULT 'Google',
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `testimonials` (`name`,`rating`,`review`,`platform`) VALUES
('Priya Sharma',5,'The place was super nice and clean!! Everything was organised correctly! The staff was nice and the atmosphere was really cozy!','Google'),
('Rahul Desai',5,'Best pizza I\'ve had in a while. The crust was super fresh and soft.','Google'),
('Ananya Joshi',5,'Chicken cheese burger and chicken sandwich are must try.','Google');

-- -------------------------------------------------------
-- Table: settings
-- -------------------------------------------------------
CREATE TABLE `settings` (
  `id`          INT(11) NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(191) NOT NULL UNIQUE,
  `setting_val` TEXT DEFAULT NULL,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `settings` (`setting_key`,`setting_val`) VALUES
('cafe_name','Buzz Cafe'),
('tagline','Where Taste Meets Vibes'),
('address','Shop No 2/4, Thakur Avenue, Kathe Ln, Bankar Chowk, Dwarka, Nashik, Maharashtra 422011'),
('phone','8788138980'),
('email','hello@buzzcafe.in'),
('whatsapp','8788138980'),
('hours_weekday','8:00 AM – 10:30 PM'),
('hours_weekend','8:00 AM – 10:30 PM'),
('google_maps_url','https://maps.google.com/?q=Buzz+Cafe+Nashik'),
('facebook_url','#'),
('instagram_url','#'),
('hero_title','Where Taste Meets Vibes'),
('hero_subtitle','A premium cafe experience in the heart of Nashik — crafted for those who love great food, great vibes, and unforgettable moments.'),
('hero_image','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1920'),
('about_text','Born in the vibrant streets of Nashik, Buzz Cafe is more than a cafe — it is a destination. We blend artisan food, handcrafted beverages, and a warm premium ambience to create an experience that keeps you coming back. Whether you are catching up with friends, working solo, or celebrating a special moment, Buzz is your perfect spot.'),
('meta_description','Buzz Cafe Nashik — Premium cafe offering rolls, pasta, desserts, cold beverages, and more. Located at Dwarka, Nashik. Open daily 8AM–10:30PM.'),
('meta_keywords','Buzz Cafe Nashik, cafe Nashik, best cafe Nashik, rolls Nashik, cold coffee Nashik, pasta Nashik'),
('show_section_menu','1'),
('show_section_gallery','1'),
('show_section_testimonials','1'),
('show_section_reservation','1'),
('show_section_services','1'),
('google_review_rating','4.9'),
('price_range','₹100 – ₹400'),
('analytics_visits','0'),
('analytics_bookings','0');

-- -------------------------------------------------------
-- Table: contact_messages
-- -------------------------------------------------------
CREATE TABLE `contact_messages` (
  `id`         INT(11) NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(191) NOT NULL,
  `email`      VARCHAR(191) NOT NULL,
  `phone`      VARCHAR(20) DEFAULT NULL,
  `subject`    VARCHAR(255) DEFAULT NULL,
  `message`    TEXT NOT NULL,
  `is_read`    TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
