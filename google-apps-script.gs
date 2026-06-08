const SHEET_ID = '1mpYXO0Ccl_FgICD4Bu8sdT7QffbVzRIr-MjbwYk18QM';
const HEADERS = [
  'Timestamp',
  'Name',
  'Gotra',
  'Phone',
  'Email',
  'Package',
  'Country',
  'Message',
  'Payment ID',
  'Status',
  'Amount'
];

function doPost(e) {
  let lock;

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ success: false, error: 'Missing request body.' });
    }

    const payload = JSON.parse(e.postData.contents);
    const booking = sanitizeBooking_(payload);
    const validationErrors = validateBooking_(booking);

    if (validationErrors.length) {
      return jsonResponse_({
        success: false,
        error: 'Validation failed.',
        details: validationErrors
      });
    }

    // Lock writes so two simultaneous paid bookings cannot overlap while appending rows.
    lock = LockService.getScriptLock();
    lock.waitLock(10000);

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    ensureHeaderRow_(sheet);

    sheet.appendRow([
      booking.timestamp,
      booking.name,
      booking.gotra,
      booking.phone,
      booking.email,
      booking.packageName,
      booking.country,
      booking.message,
      booking.paymentId,
      booking.status,
      booking.amount
    ]);

    return jsonResponse_({ success: true, message: 'Booking saved.' });
  } catch (error) {
    console.error('Google Sheets booking save failed:', error && error.stack ? error.stack : error);

    return jsonResponse_({
      success: false,
      error: 'Server error while saving booking.'
    });
  } finally {
    if (lock) {
      lock.releaseLock();
    }
  }
}

function sanitizeBooking_(payload) {
  // Sanitizes all incoming user-controlled values before appending them to the sheet.
  return {
    timestamp: sanitizeText_(payload.timestamp, 60) || new Date().toISOString(),
    name: sanitizeText_(payload.name, 120),
    gotra: sanitizeText_(payload.gotra, 120),
    phone: sanitizeText_(payload.phone, 50),
    email: sanitizeText_(payload.email, 180),
    packageName: sanitizeText_(payload.packageName, 180),
    country: sanitizeText_(payload.country, 180),
    message: sanitizeText_(payload.message, 1000),
    paymentId: sanitizeText_(payload.paymentId, 120),
    status: sanitizeText_(payload.status, 40),
    amount: sanitizeAmount_(payload.amount)
  };
}

function validateBooking_(booking) {
  const errors = [];

  if (!booking.name) errors.push('Name is required.');
  if (!booking.phone) errors.push('Phone is required.');
  if (!booking.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) errors.push('Valid email is required.');
  if (!booking.packageName) errors.push('Package is required.');
  if (!booking.paymentId) errors.push('Razorpay payment ID is required.');
  if (!booking.status) errors.push('Payment status is required.');
  if (!booking.amount || Number(booking.amount) <= 0) errors.push('Amount must be greater than zero.');

  return errors;
}

function ensureHeaderRow_(sheet) {
  // Adds the expected header row once, preventing accidental blank/ambiguous sheets.
  if (sheet.getLastRow() > 0) return;

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function sanitizeText_(value, maxLength) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function sanitizeAmount_(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
