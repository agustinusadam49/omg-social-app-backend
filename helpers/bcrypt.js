const bcrypt = require("bcryptjs");

// Fungsi digunakan pada model user di code block beforeCreate
// berfungsi untuk hashing password sebelum data masuk ke database.
function generatePassword(userPassword) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userPassword, salt);
  return hash;
}

// fungsi ini dipanggil pada api login setelah mendapatkan data user by email.
// berfungsi untuk compare data password user di database dengan input.
function comparePassword(userPasswordFromBody, userPasswordFromDatabase) {
  return bcrypt.compareSync(userPasswordFromBody, userPasswordFromDatabase);
}

module.exports = {
  generatePassword,
  comparePassword,
};
