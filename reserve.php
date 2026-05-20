<?php
/**
 * Buzz Cafe — Reservation API
 * POST /api/reserve.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed.');
}

$name     = sanitise($_POST['name'] ?? '');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone    = sanitise($_POST['phone'] ?? '');
$date     = sanitise($_POST['date'] ?? '');
$time     = sanitise($_POST['time'] ?? '');
$guests   = (int)($_POST['guests'] ?? 2);
$occasion = sanitise($_POST['occasion'] ?? '');
$message  = sanitise($_POST['message'] ?? '');

// Validate
$errors = [];
if (strlen($name) < 2)     $errors[] = 'Please enter a valid name.';
if (!$email)                $errors[] = 'Please enter a valid email address.';
if (strlen($phone) < 10)   $errors[] = 'Please enter a valid phone number.';
if (empty($date))           $errors[] = 'Please select a date.';
if (empty($time))           $errors[] = 'Please select a time.';
if ($guests < 1 || $guests > 20) $errors[] = 'Guests must be between 1 and 20.';

// Date must not be in the past
if (!empty($date) && strtotime($date) < strtotime('today')) {
    $errors[] = 'Reservation date cannot be in the past.';
}

if (!empty($errors)) {
    jsonResponse(false, implode(' ', $errors));
}

try {
    $db = getDB();
    $stmt = $db->prepare('
        INSERT INTO reservations (name, email, phone, date, time, guests, occasion, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([$name, $email, $phone, $date, $time, $guests, $occasion, $message]);

    // Increment analytics counter
    $db->exec("UPDATE settings SET setting_val = setting_val + 1 WHERE setting_key = 'analytics_bookings'");

    jsonResponse(true, "Thank you, $name! Your table has been reserved. We'll confirm shortly on $email.");
} catch (Exception $e) {
    jsonResponse(false, 'Something went wrong. Please try again or call us directly.');
}
