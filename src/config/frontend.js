const url =
  process.env.NODE_ENV === "production"
    ? "https://blazehub.skyblazar.com/"
    : "http://localhost:3000";

module.exports = { url };
