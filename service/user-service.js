const UserModel = require("../models/user-model.js");
const bcrypt = require("bcrypt");

class UserService {
  async registration(username, password, stats) {
    const candidate = await UserModel.findOne({ username });
    if (candidate) {
      console.log(`Пользователь с именем ${username} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 3);

    const user = await UserModel.create({
      username,
      password: hashPassword,
      stats: stats,
    });

    return { user };
  }

  async login(username, password) {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким username не найден");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
}

module.exports = new UserService();
