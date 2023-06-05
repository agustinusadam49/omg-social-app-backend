const {
  Users,
  Posts,
  Profiles,
  Likes,
  Messages,
  Follows,
} = require("../models");
const { generateToken } = require("../helpers/jwt");
const { generatePassword, comparePassword } = require("../helpers/bcrypt");
const { Op } = require("sequelize");
// const nodemailer = require('nodemailer');

class UserControllers {
  static registerUser(req, res, next) {
    const userEmail = req.body.userEmail;
    let newUser = null;
    Users.findOne({ where: { userEmail: userEmail } })
      .then((userDataByEmail) => {
        if (userDataByEmail) {
          throw {
            status: "401 Unauthorized!",
            errorMessage: `Sorry this email's been used, create new or use other one!`,
            code: 401,
          };
        } else {
          const newUserToCreate = {
            userFullname: req.body.userFullname,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: req.body.userPassword,
          };
          return Users.create(newUserToCreate);
        }
      })
      .then((createdNewUser) => {
        if (createdNewUser) {
          newUser = createdNewUser;
          const newUserProfileObj = {
            biodata: null,
            address: null,
            birthDate: null,
            status: null,
            quotes: null,
            phoneNumber: null,
            UserId: newUser.id,
          };
          return Profiles.create(newUserProfileObj);
        } else if (!createdNewUser) {
          throw {
            status: "301 Failed to register new user!",
            errorMessage: "Failed user register!",
            code: 301,
            success: false,
          };
        }
      })
      .then((profilesResponse) => {
        if (profilesResponse) {
          const token = generateToken({
            id: newUser.id,
            email: newUser.userEmail,
            password: newUser.userPassword,
          });

          res.status(201).json({
            status: "201 Success Register New User!",
            message: "Success register new user!",
            newUserData: newUser,
            newUserProfileData: profilesResponse,
            emailVerificationStatus: newUser.emailVerified,
            user_token: token,
            user_name: newUser.userName,
            user_id: newUser.id,
            user_email: newUser.userEmail,
            success: true,
          });
        } else if (!profilesResponse) {
          throw {
            status: "400 Failed to create profile for new user!",
            errorMessage: "Failed create a profile for a new user",
            code: 400,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static userLogin(req, res, next) {
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    let userDataFinal = null;
    let userId = null;

    if (!userEmail) {
      throw {
        status: "400 Bad Request",
        errorMessage: "Email cannot be empty (from user controller)!",
        code: 400,
      };
    }

    if (!userPassword) {
      throw {
        status: "400 Bad Request",
        errorMessage: "Password cannot be empty (from user controllers)!",
        code: 400,
      };
    }

    Users.findOne({ where: { userEmail: userEmail } })
      .then((userDataByEmail) => {
        if (userDataByEmail) {
          if (userDataByEmail.userOnlineStatus === true) {
            throw {
              status: "400 Bad request!",
              errorMessage: "You have been logged, plese logout first!",
              code: 409,
            };
          } else if (userDataByEmail.userOnlineStatus === false) {
            const isPasswordValid = comparePassword(
              userPassword,
              userDataByEmail.userPassword
            );
            if (isPasswordValid) {
              userDataFinal = userDataByEmail;
              userId = userDataFinal.id;
              return Users.update(
                { userOnlineStatus: true },
                { where: { id: userId } }
              );
            } else if (!isPasswordValid) {
              throw {
                status: "401 Password is Wrong!",
                errorMessage: "Password yang anda masukan salah!",
                code: 401,
              };
            }
          }
        } else if (!userDataByEmail) {
          throw {
            status: "401 Email is Wrong!",
            errorMessage: "Maaf email yang anda masukan salah!",
            code: 401,
          };
        }
      })
      .then((userUpdateResultOnLogin) => {
        if (userUpdateResultOnLogin == 1) {
          const token = generateToken({
            id: userDataFinal.id,
            email: userDataFinal.userEmail,
            password: userDataFinal.userPassword,
          });

          res.status(200).json({
            status: "200 Success Login!",
            message: "Success login a user",
            userDataLogin: userDataFinal,
            emailVerificationStatus: userDataFinal.emailVerified,
            user_token: token,
            user_id: userDataFinal.id,
            user_name: userDataFinal.userName,
            user_email: userDataFinal.userEmail,
          });
        } else if (userUpdateResultOnLogin == 0) {
          throw {
            status: "404 Not Found!",
            errorMessage: "Cannot found the user!",
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static sendEmailVerification(req, res, next) {
    const userId = req.params.id;
    let userEmailVerifiedStatusBody = {
      emailVerified: true,
    };
    Users.update(userEmailVerifiedStatusBody, { where: { id: userId } })
      .then((userEmailVerifiedResult) => {
        if (userEmailVerifiedResult == 1) {
          res.status(201).json({
            status: "201 Updated user emailVerified status to true!",
            message: `Berhasil verify email user dengan id: ${userId}`,
            code: 201,
          });
        } else if (userEmailVerifiedResult == 0) {
          throw {
            status: "Not Found!",
            message: `Maaf data user dengan id: ${userId} tidak ada!`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static userLogout(req, res, next) {
    const userId = req.params.id;
    let userOnlineStatusBody = {
      userOnlineStatus: req.body.userOnlineStatus,
    };
    Users.update(userOnlineStatusBody, { where: { id: userId } })
      .then((userLogoutResult) => {
        if (userLogoutResult == 1) {
          res.status(201).json({
            status: "201 Updated to logout user!",
            message: `Berhasil logout user dengan id: ${userId}`,
            code: 201,
            success: true,
          });
        } else if (userLogoutResult == 0) {
          throw {
            status: "Not Found!",
            message: `Maaf data user dengan id: ${userId} tidak ada!`,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getCurrentUserLogin(req, res, next) {
    const currentUserId = req.userDataId;
    let currentUserData = [];
    Users.findByPk(currentUserId, {
      include: [
        { model: Posts, include: { model: Likes } },
        { model: Follows },
      ],
    })
      .then((currentUserDataById) => {
        if (currentUserDataById) {
          currentUserData.push(currentUserDataById);
          return Profiles.findOne({
            where: { UserId: currentUserId },
            include: {
              model: Follows,
            },
          });
        } else if (!currentUserDataById) {
          throw {
            status: "404 Not Found!",
            message: `Maaf data current user dengan id: ${currentUserId} tidak dapat ditemukan!`,
            code: 404,
            success: false,
          };
        }
      })
      .then((profiles) => {
        if (profiles) {
          const followerResponse = profiles.Follows

          const followerMapped = followerResponse.map((follower) => ({
            id: follower.id,
            ProfileId: follower.ProfileId,
            UserId: follower.UserId,
            createdAt: follower.createdAt,
            updatedAt: follower.updatedAt,
          }));

          const userDataMapped = currentUserData.map((item) => {
            return {
              id: item.id,
              userFullname: item.userFullname,
              userName: item.userName,
              userEmail: item.userEmail,
              userOnlineStatus: item.userOnlineStatus,
              emailVerified: item.emailVerified,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              posts: item.Posts,
              profile: profiles,
              following: item.Follows,
              followers: followerMapped,
            };
          });

          const token = generateToken({
            id: userDataMapped[0].id,
            email: userDataMapped[0].userEmail,
            password: userDataMapped[0].userPassword,
          });

          res.status(200).json({
            status: "200 Ok!",
            message: "Berhasil mendapatkan current user by id",
            users: userDataMapped[0],
            user_token: token,
            user_id: userDataMapped[0].id,
            user_name: userDataMapped[0].userName,
            user_email: userDataMapped[0].userEmail,
            code: 200,
            success: true,
          });
        } else if (!profiles) {
          throw {
            status: "400 Bad Requests!",
            message: "Maaf gagal untuk mengambil data profile",
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getAllUsersOfOmonginApp(req, res, next) {
    Users.findAll({
      include: [{ model: Profiles }, { model: Messages }],
      order: [["id", "DESC"]],
    })
      .then((userDataOmonginApp) => {
        if (userDataOmonginApp.length > 0) {
          res.status(200).json({
            status: "200 Ok!",
            message: "Semua User Data di Aplikasi Website Omongin!",
            userData: userDataOmonginApp,
          });
        } else if (userDataOmonginApp.length < 1) {
          throw {
            status: "404 Cannot find any users!",
            message: "Belum ada user sama sekali!",
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getAllUsersOfOmonginAppForAdmin(req, res, next) {
    const orderBy = req.body.orderBy;
    const orderWay = req.body.orderWay;

    Users.findAll({
      include: { model: Posts },
      order: [[`${orderBy}`, `${orderWay}`]],
    })
      .then((userDataOmonginApp) => {
        if (userDataOmonginApp.length > 0) {
          const mappedUserData = userDataOmonginApp.map((item) => {
            const users = new Users();
            users.userFullname = item.userFullname;
            return { ...item.dataValues, greeting: users.greeting() };
          });
          res.status(200).json({
            status: "200 Ok!",
            message: "Semua User Data di Aplikasi Website Omongin!",
            userData: userDataOmonginApp,
            userDataMappedWithGreeting: mappedUserData,
          });
        } else if (userDataOmonginApp.length < 1) {
          throw {
            status: "404 Cannot find any users!",
            message: "Belum ada user sama sekali!",
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getUserById(req, res, next) {
    const userId = req.params.id;
    Users.findByPk(userId, {
      include: [
        {
          model: Profiles,
          include: { model: Follows, include: { model: Users, include: {model: Profiles} } },
        },
        {
          model: Follows,
          include: { model: Users, include: { model: Profiles } },
        },
      ],
    })
      .then((userDataById) => {
        if (userDataById) {
          res.status(200).json({
            status: "200 Ok!",
            message: `Data user dengan id: ${userId}!`,
            userByIdData: userDataById,
            userByIdFollower: userDataById.Profile.Follows,
            userByIdFollowing: userDataById.Follows,
          });
        } else if (!userDataById) {
          throw {
            status: "404 User is not found!",
            message: `Maaf tidak dapat menemukan data user dengan ID: ${userId}.`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static updateUserById(req, res, next) {
    const userId = req.params.id;
    const dataUserReadyToUpdate = {
      userFullname: req.body.userFullname,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPassword: generatePassword(req.body.userPassword),
    };
    Users.update(dataUserReadyToUpdate, { where: { id: userId } })
      .then((userUpdateResult) => {
        if (userUpdateResult == 1) {
          res.status(204).json({
            status: "201 Success update user data!",
            message: `Berhasil edit data user dengan ID: ${userId}!`,
            code: 204,
          });
        } else if (!userUpdateResult == 0) {
          throw {
            status: "404 User Not Found!",
            message: `Maaf data user dengan ID: ${userId} tidak dapat ditemukan!`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteUserById(req, res, next) {
    const userId = req.params.id;
    Users.destroy({ where: { id: userId } })
      .then((deletedUserDataResult) => {
        if (deletedUserDataResult == 1) {
          res.status(200).json({
            status: "200 Success Delete User",
            message: `Berhasil menghapus data user dengan ID: ${userId}!`,
            code: 200,
          });
        } else if (deletedUserDataResult == 0) {
          throw {
            status: "404 User Not Found!",
            message: `Maaf data user dengan ID: ${userId} tidak dapat ditemukan!`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static searchForUser(req, res, next) {
    const searchTerms = req.query.searchTerms;

    Users.findAll({
      where: {
        [Op.or]: [
          { userFullname: { [Op.substring]: searchTerms } },
          { userName: { [Op.substring]: searchTerms } },
          { userEmail: { [Op.substring]: searchTerms } },
        ],
      },
      include: { model: Profiles },
    })
      .then((userDataOmonginApp) => {
        if (userDataOmonginApp.length > 0) {
          res.status(200).json({
            status: "200 Ok!",
            message: `Hasil search user berdasarkan keyword: ${searchTerms}!`,
            userData: userDataOmonginApp,
          });
        } else if (userDataOmonginApp.length < 1) {
          throw {
            status: "404 Cannot find any users!",
            message: `Tidak ada hasil search dari keyword: ${searchTerms}!`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserControllers;
