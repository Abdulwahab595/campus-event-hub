const { randomBytes, scrypt, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");

const deriveKey = promisify(scrypt);

function passwordKey(password, salt) {
  return deriveKey(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 });
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await passwordKey(password, salt);
  return `${salt}:${hash.toString("hex")}`;
}

async function checkPassword(password, storedHash) {
  if (typeof storedHash !== "string" || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(storedHash)) {
    return false;
  }

  const [salt, hash] = storedHash.split(":");
  const enteredHash = await passwordKey(password, salt);
  return timingSafeEqual(enteredHash, Buffer.from(hash, "hex"));
}

module.exports = { hashPassword, checkPassword };
