/**
 * Scrambles a base64 string using a simple shift cipher based on a password pin hash.
 * This runs fast and runs client-side to obfuscate the standard image source preview.
 * 
 * @param {string} base64Str - The raw base64 data string
 * @param {string} password - The encryption key password
 * @returns {string} The obfuscated base64 string
 */
export const scrambleBase64 = (base64Str, password) => {
  if (!password) return base64Str;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let shift = 0;
  for (let i = 0; i < password.length; i++) {
    shift += password.charCodeAt(i);
  }
  shift = shift % 64 || 1;

  let scrambled = '';
  for (let i = 0; i < base64Str.length; i++) {
    const char = base64Str[i];
    const idx = chars.indexOf(char);
    if (idx === -1) {
      scrambled += char;
    } else {
      scrambled += chars[(idx + shift) % 65]; // Use 65 length to keep it shifting beautifully
    }
  }
  return scrambled;
};
