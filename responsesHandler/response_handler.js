const commonStatus = require("../core/constants/common_status");
// Basic Response
exports.httpResponse = ({ response, statusCode, status, message, data }) =>
  response.status(statusCode).json({ status, message, data });

// When Everything is ok send this one
exports.okHttpResponse = ({ response, message, data }) =>
  response
    .status(commonStatus.statusCode.ok)
    .json({ status: commonStatus.response_status.success, message, data });

// When There is error in data which leads to failure send this one
exports.okHttpResponseFailure = ({ response, message, data }) =>
  response
    .status(commonStatus.statusCode.ok)
    .json({ status: commonStatus.response_status.failure, message, data });

// When got a bad request send this one
exports.badHttpResponse = ({ response, message, data }) =>
  response
    .status(commonStatus.statusCode.bad_request)
    .json({ status: commonStatus.response_status.failure, message, data });

// For internal server error
exports.serverHttpResponse = ({ response, message }) =>
  response
    .status(commonStatus.statusCode.internal_server_error)
    .json({ status: commonStatus.response_status.failure, message });

// For unauthorized user
exports.unauthorizedHttpResponse = ({ response, message }) =>
  response
    .status(commonStatus.statusCode.unauthorized)
    .json({ status: commonStatus.response_status.failure, message });

// For forbidden error
exports.forbiddenHttpResponse = ({ response, message }) =>
  response
    .status(commonStatus.statusCode.forbidden)
    .json({ status: commonStatus.response_status.failure, message });

// For validations error

exports.validationHttpResponse = ({ response, message, errors }) =>
  response
    .status(commonStatus.statusCode.validationError)
    .json({ status: commonStatus.response_status.failure, message, errors });
