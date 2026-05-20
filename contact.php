<?php
/**
 * Buzz Cafe — Contact API
 * POST /api/contact.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed.');
}

$name    = sanitise($_POST['name'] ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone   = sanitise($_POST['phone'] ?? '');
$subject = sanitise($_POST['subject'] ?? '');
$message = sanitise($_POST['message'] ?? '');

$errors = [];
if (strlen($name) < 2)     $errors[] = 'Please enter a valid name.';
if (!$email)               $errors[] = 'Please enter a valid email address.';
if (strlen($message) < 10) $errors[] = 'Message must be at least 10 characters.';

if (!empty($errors)) {
    jsonResponse(false, implode(' ', $errors));
}

try {
    $db   = getDB();
    $stmt = $db->prepare('
        INSERT INTO contact_messages (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    ');
    $stmt->execute([$name, $email, $phone, $subject, $message]);

    jsonResponse(true, "Thank you, $name! We've received your message and will get back to you soon.");
} catch (Exception $e) {
    jsonResponse(false, 'Something went wrong. Please try again.');
}
