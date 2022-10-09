const userService = require("../service/user-service");
// const {validationResult} = require('express-validator');
// const ApiError = require('../exceptions/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      const statsDefault = {
        win: 0,
        loss: 0,
        surrender: 0,
        bar: [
          {
            name: 1,
            percent: "0%",
            count: 0,
          },
          {
            name: 2,
            percent: "0%",
            count: 0,
          },
          {
            name: 3,
            percent: "0%",
            count: 0,
          },
          {
            name: 4,
            percent: "0%",
            count: 0,
          },
          {
            name: 5,
            percent: "0%",
            count: 0,
          },
          {
            name: 6,
            percent: "0%",
            count: 0,
          },
        ],
      };

      const { username, password, stats = statsDefault } = req.body;

      const userData = await userService.registration(
        username,
        password,
        stats
      );
      return res.json({
        id: userData.user._id,
        username: userData.user.username,
        stats: userData.user.stats,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
