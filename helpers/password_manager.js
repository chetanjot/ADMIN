const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0//", salt);

exports.encryptPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, hash, (err, pwHash) => {
      if (err) reject(err);
      resolve(pwHash);
    });
  });

exports.comparePassword = ({ plainPassword, hashPassword }) =>
  new Promise((resolve, reject) => {
    // Load hash from the db, which was previously stored
    bcrypt.compare(plainPassword, hashPassword, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
