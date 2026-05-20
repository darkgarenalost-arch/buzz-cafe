<?php
/**
 * Buzz Cafe — Helper Functions
 */

require_once __DIR__ . '/db.php';

/**
 * Fetch a single setting value
 */
function getSetting(string $key, string $default = ''): string {
    static $cache = [];
    if (!isset($cache[$key])) {
        $db   = getDB();
        $stmt = $db->prepare('SELECT setting_val FROM settings WHERE setting_key = ? LIMIT 1');
        $stmt->execute([$key]);
        $row        = $stmt->fetch();
        $cache[$key] = $row ? (string)$row['setting_val'] : $default;
    }
    return $cache[$key];
}

/**
 * Fetch all settings as key=>val array
 */
function getAllSettings(): array {
    $db   = getDB();
    $rows = $db->query('SELECT setting_key, setting_val FROM settings')->fetchAll();
    $out  = [];
    foreach ($rows as $r) {
        $out[$r['setting_key']] = $r['setting_val'];
    }
    return $out;
}

/**
 * Update a setting
 */
function updateSetting(string $key, string $val): void {
    $db   = getDB();
    $stmt = $db->prepare('INSERT INTO settings (setting_key, setting_val) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_val=VALUES(setting_val)');
    $stmt->execute([$key, $val]);
}

/**
 * Sanitise output for HTML
 */
function e(string $str): string {
    return htmlspecialchars($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/**
 * Sanitise input
 */
function sanitise(string $val): string {
    return trim(strip_tags($val));
}

/**
 * JSON response and exit
 */
function jsonResponse(bool $success, string $message, array $data = []): void {
    header('Content-Type: application/json');
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $data));
    exit;
}

/**
 * CSRF token generation and validation
 */
function csrfToken(): string {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrf(string $token): bool {
    if (session_status() === PHP_SESSION_NONE) session_start();
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Get menu items grouped by category
 */
function getMenuGrouped(): array {
    $db   = getDB();
    $cats = $db->query('SELECT * FROM menu_categories WHERE is_active=1 ORDER BY sort_order')->fetchAll();
    $out  = [];
    foreach ($cats as $cat) {
        $stmt = $db->prepare('SELECT * FROM menu_items WHERE category_id=? AND is_active=1 ORDER BY sort_order,id');
        $stmt->execute([$cat['id']]);
        $cat['items'] = $stmt->fetchAll();
        $out[] = $cat;
    }
    return $out;
}

/**
 * Get featured menu items
 */
function getFeaturedItems(int $limit = 8): array {
    $db   = getDB();
    $stmt = $db->prepare('SELECT mi.*, mc.name AS category_name FROM menu_items mi JOIN menu_categories mc ON mc.id=mi.category_id WHERE mi.is_featured=1 AND mi.is_active=1 ORDER BY mi.id LIMIT ?');
    $stmt->execute([$limit]);
    return $stmt->fetchAll();
}

/**
 * Get active testimonials
 */
function getTestimonials(): array {
    $db = getDB();
    return $db->query('SELECT * FROM testimonials WHERE is_active=1 ORDER BY sort_order,id')->fetchAll();
}

/**
 * Get active gallery images
 */
function getGallery(): array {
    $db = getDB();
    return $db->query('SELECT * FROM gallery WHERE is_active=1 ORDER BY sort_order,id')->fetchAll();
}

/**
 * Validate image upload and save
 */
function handleImageUpload(array $file, string $prefix = 'img'): array {
    $allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    if (!in_array($file['type'], $allowed, true)) {
        return ['success' => false, 'message' => 'Only JPG, PNG, WebP, GIF allowed.'];
    }
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['success' => false, 'message' => 'File too large (max 5 MB).'];
    }
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }
    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $prefix . '_' . uniqid() . '.' . strtolower($ext);
    $dest     = UPLOAD_DIR . $filename;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        return ['success' => false, 'message' => 'Failed to move file.'];
    }
    return ['success' => true, 'url' => UPLOAD_URL . $filename, 'filename' => $filename];
}

/**
 * Increment visit analytics
 */
function trackVisit(): void {
    $db   = getDB();
    $db->exec("UPDATE settings SET setting_val = setting_val + 1 WHERE setting_key = 'analytics_visits'");
}
