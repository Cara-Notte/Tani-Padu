function normalizeWhatsAppNumber(phoneNumber: string) {
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  if (digitsOnly.startsWith('0')) {
    return `62${digitsOnly.slice(1)}`;
  }

  return digitsOnly;
}

export function createWhatsAppLink(phoneNumber: string, message: string) {
  const normalizedPhoneNumber = normalizeWhatsAppNumber(phoneNumber);
  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(message)}`;
}
