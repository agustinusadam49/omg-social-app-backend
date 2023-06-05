const { Users } = require("../models");
const { verifyToken } = require("../helpers/jwt");

function checkUserEmailVerificationStatus(req, res, next) {
  const userToken = req.headers.token;
  try {
    const decoded = verifyToken(userToken);
    if (decoded) {
      const userEmail = decoded.email;
      Users.findOne({ where: { userEmail: userEmail } })
        .then((userDataByEmail) => {
          if (userDataByEmail) {
            if (userDataByEmail.emailVerified === true) {
              next();
            } else if (userDataByEmail.emailVerified === false) {
              throw {
                status: "401 Unauthorized!",
                message: "Need verify this user's email first!",
                code: 401,
              };
            }
          } else if (!userDataByEmail) {
            throw {
              status: "401 Unauthorized!",
              message: "This user has been deleted from DB",
              code: 401,
            };
          }
        })
        .catch((err) => {
          next(err);
        });
    } else if (!decoded) {
      throw {
        status: "401 Unauthorized!",
        message: "User must register first!",
        code: 401,
      };
    }
  } catch (err) {
    next(err);
  }
}

module.exports = checkUserEmailVerificationStatus;
