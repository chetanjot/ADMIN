const jwtHelper = require("../../helpers/jwt_helper");
const User = require("../../models/users/users");
const response = require("../../responsesHandler/response_handler");
const { messages } = require("../../core/constants/server_messages");
const { userStatus } = require("../../core/constants/common_status");
const UserAccessToken = require("../../models/users/user_access_tokens");

exports.isAuthenticated = async (req, res, next) => {
  try {
    let isVerified;
    const token = req.headers.authorization;
    // check if bearer token exists or not.
    if (!token || !req.headers.authorization.startsWith("Bearer")) {
      return response.unauthorizedHttpResponse({
        response: res,
        message:  messages[req.language].unauthorizedUser,
      });
    }

    // verify JWT token(bearer token).
    try {
      isVerified = await jwtHelper.jwtVerify(token.split(" ")[1]);
    } catch (error) {
      return response.unauthorizedHttpResponse({
        response: res,
        message:  messages[req.language].unauthorizedUser,
      });
    }

    // check if user exists.

    const user = await User.findById(isVerified.aud);
    if (!user) {
      return response.unauthorizedHttpResponse({
        response: res,
        message:  messages[req.language].incorrectEmailOrPassword,
      });
    }

    // Check if user is verified or not
    // if (!user.isVerified) {
    //   return response.unauthorizedHttpResponse({
    //     response: res,
    //     message:  messages[req.language].incorrectEmailOrPassword,
    //   });
    // }

    // if (user.status === userStatus.inactive) {
    //   return response.unauthorizedHttpResponse({
    //     response: res,
    //     message:  messages[req.language].userIsBlocked,
    //   });
    // }
    // verify JWT token(bearer token) in db
    let userAccessTokenExist = false;
    const userAccessToken = await UserAccessToken.find({
      user_id: isVerified.aud,
    });
    await Promise.all(
      userAccessToken.map(async (userToken) => {
        const checkPw = jwtHelper.decryptAccessToken({
          plainAccessToken: token.split(" ")[1],
          hashAccessToken: userToken.access_token,
        });
        if (checkPw) {
          userAccessTokenExist = true;
        }
      })
    );
    if (!userAccessTokenExist) {
      return response.unauthorizedHttpResponse({
        response: res,
        message:  messages[req.language].unauthorizedUser,
      });
    }
    // set user id in request.
    req.user = user.id;

    req.isVerified = user.isVerified;
    next();
  } catch (error) {
    return response.serverHttpResponse({
      response: res,
      message: error,
    });
  }
};
