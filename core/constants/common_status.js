// Common Server Status Code
exports.statusCode = {
  ok: 200,
  bad_request: 400,
  internal_server_error: 500,
  unauthorized: 401,
  forbidden: 403,
  validationError: 422,
};
exports.otpOperations = {
  emailVerification: 1,
  passwordReset: 2,
};
// Response Status Code
exports.response_status = {
  success: 1,
  failure: 0,
};

// Different User Role
exports.userRoles = {
  Admin: 1,
  USER: 2,
};

// User Status
exports.userStatus = {
  pending: 0,
  active: 1,
  inactive: 2,
  deleteRequested: 3,
};

exports.TOKENOPREATIONS = {
  OTPVERIFICATION: 0,
  PASSWORDRESET: 1,
  CHANGEPASSWORD: 2,
  CLIENTPASSWORDCREATE: 3,
};

// Types of assets
exports.assetType = {
  video: 1,
  podcast: 2,
  webcast: 3,
  slides: 4,
  pdf: 5,
};



// directory structure s3
exports.foldersS3 = {
  thumbnails: "thumbnails/",
  documents: "content/documents/",
  videos: "content/videos/",
  images: "content/images/",
};

// content images type
exports.image_type = {
  large: 1,
  small: 2,
};

exports.jwtExpires = {
  login: "1d",
  refresh: "2d",
  // login: '60s',
  // refresh: '120s',
  loginRemember: "365d",
  refreshRemember: "366d",
};
