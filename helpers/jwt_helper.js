const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const CryptoJS = require('crypto-js');

exports.jwtSign = (user, expires) =>
  new Promise((resolve, reject) => {
    const payload = { email: user.email };
    // const secret = fs.readFileSync(
    //   path.join(__dirname, "../core/private.key")
    // );
    const secret = process.env.SECRET_KEY
    const options = {
      expiresIn: expires,
      audience: user.id,
      // algorithm: "RS256",
    };
    jwt.sign(payload, secret, options, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
  exports.jwtSignTwitter = (user, expires) =>
  new Promise((resolve, reject) => {
    const payload = { username: user.username };
    // const secret = fs.readFileSync(
    //   path.join(__dirname, "../core/private.key")
    // );
    const secret = process.env.SECRET_KEY
    const options = {
      expiresIn: expires,
      audience: user.id,
      // algorithm: "RS256",
    };
    jwt.sign(payload, secret, options, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

exports.jwtVerify = (token) =>
  new Promise((resolve, reject) => {
    // const secret = fs.readFileSync(
    //   path.join(__dirname, "../core/private.key")
    // );
    const secret = process.env.SECRET_KEY
    jwt.verify(token, secret, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });


  // encrypt decrypt access token
exports.encryptAccessToken = (access_token) => {
  try {
      const encryptedToken = CryptoJS.AES.encrypt(access_token, 'EY6dkmt9X0ZHuoR9mv6V2n8yTb9OC').toString();
      return encryptedToken;
  } catch (err) {
      console.error('Encryption error:', err);
  }
};

exports.decryptAccessToken = ({
  plainAccessToken, hashAccessToken,
}) => {
  try {
      const decrypted = CryptoJS.AES.decrypt(hashAccessToken, 'EY6dkmt9X0ZHuoR9mv6V2n8yTb9OC');
      const originalText = decrypted.toString(CryptoJS.enc.Utf8);
      if (originalText === plainAccessToken) {
          return true;
      }
      return false;
  } catch (err) {
      console.error('Decryption error:', err);
  }
};
