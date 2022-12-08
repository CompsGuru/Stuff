// Client Seed: hash of ETH block 16084230 (0x9b7d58e36dd542604d84c0d253f0cdd993ba193a974c32d9d50e27628a17392f)
// 2 millionth server seed: 8268068224d61ef1c0392f735a3ef29c38ef404ef26272c08457ca277d6c00a6
// Public Seed Event: https://pastebin.com/6j468vzE

const crypto = require("crypto");

const crashHash = "";
const salt =
  "0x9b7d58e36dd542604d84c0d253f0cdd993ba193a974c32d9d50e27628a17392f";

function saltHash(hash) {
  return crypto.createHmac("sha256", hash).update(salt).digest("hex");
}

function generateHash(seed) {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

function divisible(hash, mod) {
  // We will read in 4 hex at a time, but the first chunk might be a bit smaller
  // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
  var val = 0;

  var o = hash.length % 4;
  for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
    val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
}

function crashPointFromHash(serverSeed) {
  const hash = crypto
    .createHmac("sha256", serverSeed)
    .update(salt)
    .digest("hex");

  const hs = parseInt(100 / 4);
  if (divisible(hash, hs)) {
    return 1;
  }

  const h = parseInt(hash.slice(0, 52 / 4), 16);
  const e = Math.pow(2, 52);

  return Math.floor((100 * e - h) / (e - h)) / 100.0;
}

function getPreviousGames() {
  const previousGames = [];
  let gameHash = generateHash(crashHash);

  for (let i = 0; i < 100; i++) {
    const gameResult = crashPointFromHash(gameHash);
    previousGames.push({ gameHash, gameResult });
    gameHash = generateHash(gameHash);
  }

  return previousGames;
}

function verifyCrash() {
  const gameResult = crashPointFromHash(crashHash);
  const previousHundredGames = getPreviousGames();

  return { gameResult, previousHundredGames };
}

console.log(verifyCrash());
