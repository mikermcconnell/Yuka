export function isValidBarcode(barcode: string): boolean {
  // Remove any whitespace
  const cleaned = barcode.replace(/\s/g, '');

  // Must be numeric and 8-14 digits (common barcode lengths)
  if (!/^\d{8,14}$/.test(cleaned)) {
    return false;
  }

  // Validate checksum for EAN-13, EAN-8, UPC-A
  if (cleaned.length === 13) {
    return validateEAN13(cleaned);
  }
  if (cleaned.length === 8) {
    return validateEAN8(cleaned);
  }
  if (cleaned.length === 12) {
    return validateUPCA(cleaned);
  }

  // For other lengths, just check if numeric
  return true;
}

function validateEAN13(barcode: string): boolean {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(barcode[12], 10);
}

function validateEAN8(barcode: string): boolean {
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(barcode[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(barcode[7], 10);
}

function validateUPCA(barcode: string): boolean {
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(barcode[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(barcode[11], 10);
}

export function sanitizeBarcode(barcode: string): string {
  return barcode.replace(/\D/g, '');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidListName(name: string): boolean {
  // Must be 1-50 characters, no special characters except spaces, hyphens, underscores
  return /^[\w\s-]{1,50}$/.test(name);
}

export function isValidRating(rating: number): boolean {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}
