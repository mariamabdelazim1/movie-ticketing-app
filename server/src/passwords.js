import crypto from "crypto";

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(password) {
  if (isPasswordHash(password)) return password;

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${ITERATIONS}:${salt}:${hash}`;
}

export function isPasswordHash(password) {
  return typeof password === "string" && /^\d+:[a-f0-9]{32}:[a-f0-9]{128}$/i.test(password);
}

export function verifyPassword(password, storedPassword) {
  if (!isPasswordHash(storedPassword)) {
    return password === storedPassword;
  }

  const [iterations, salt, originalHash] = storedPassword.split(":");
  if (!iterations || !salt || !originalHash) return false;

  const hash = crypto
    .pbkdf2Sync(password, salt, Number(iterations), KEY_LENGTH, DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
}
