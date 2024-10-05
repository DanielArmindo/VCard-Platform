const apiDomain = import.meta.env.VITE_API_DOMAIN;
const wsConnection = import.meta.env.VITE_WS_CONNECTION;

export function getPhotoURL(url) {
  return `${apiDomain}/storage/fotos/${url}`;
}

export function getUrlDomain() {
  return apiDomain;
}

export function getWsConnection() {
  return wsConnection;
}

// ================== Functions for checking fields

export function verfPhoneNumber(numero) {
  // start with 9 and have 9 digits at total
  const regex = /^9\d{8}$/;
  return regex.test(numero);
}

export function verfConfirmCode(numero) {
  // only 3 digits
  const regex = /^[0-9]{3}$/;
  return regex.test(numero);
}

export function verfEmail(email) {
  //Email format
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function verfPassword(str) {
  // verify if string contains at least 3 chars/digits
  const regex = /^.{3,}$/;
  return regex.test(str);
}

export function verfUsername(str) {
  if (verfPhoneNumber(str) || verfEmail(str)) {
    return true;
  }
  return false;
}

export function verfStringNotEmpty(str) {
  return str.trim() !== "";
}

export function verfIsNumber(str) {
  return /^\d+$/.test(str);
}
