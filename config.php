<?php
/**
 * Buzz Cafe — Database Configuration
 * Edit these values to match your hosting environment
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');          // Change to your DB username
define('DB_PASS', '');              // Change to your DB password
define('DB_NAME', 'buzz_cafe');
define('DB_CHARSET', 'utf8mb4');

define('SITE_URL',   'http://localhost/buzz-cafe');  // Change to your live domain
define('ADMIN_URL',  SITE_URL . '/admin');
define('UPLOAD_DIR', __DIR__ . '/../assets/images/uploads/');
define('UPLOAD_URL', SITE_URL . '/assets/images/uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5 MB

define('TIMEZONE', 'Asia/Kolkata');
date_default_timezone_set(TIMEZONE);

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
session_name('BUZZ_ADMIN_SESSION');
