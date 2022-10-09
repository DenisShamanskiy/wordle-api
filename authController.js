const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

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

const statsTest = {
  win: 2,
  loss: 4,
  surrender: 1,
  bar: [
    {
      name: 1,
      percent: "50%",
      count: 1,
    },
    {
      name: 2,
      percent: "0%",
      count: 0,
    },
    {
      name: 3,
      percent: "50%",
      count: 1,
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

const updateStats = {
  win: 10,
  loss: 20,
  surrender: 30,
  bar: [
    {
      name: 1,
      percent: "150%",
      count: 12,
    },
    {
      name: 2,
      percent: "0%",
      count: 0,
    },
    {
      name: 3,
      percent: "50%",
      count: 1,
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

class authController {
  // async registration(req, res) {
  //   try {
  //     const { username, password, stats = statsTest } = req.body;
  //     const candidate = await User.findOne({ username });
  //     if (candidate) {
  //       return res
  //         .status(400)
  //         .json({ message: "Пользователь с таким именем уже существует" });
  //     }
  //     const hashPassword = bcrypt.hashSync(password, 7);
  //     const user = new User({
  //       username,
  //       password: hashPassword,
  //       stats: stats,
  //     });
  //     const user = await UserModel.create({email, password: hashPassword, activationLink})
  //     await user.save();
  //     return res.json({
  //       user.username,
  //       message: "Пользователь успешно зарегистрирован",
  //     });
  //     // return res.json({ message: "Пользователь успешно зарегистрирован" });
  //   } catch (e) {
  //     console.log(e);
  //     res.status(400).json({ message: "Registration error" });
  //   }
  // }

  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${username} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Введен неверный пароль` });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }

  async getUserStats(req, res) {
    try {
      const { _id } = req.body;
      const user = await User.findById(_id);
      res.json(user.stats);
    } catch (e) {
      console.log(e);
    }
  }

  async updateUserStats(req, res) {
    try {
      const { _id, stats = updateStats } = req.body;
      User.findByIdAndUpdate(_id, { stats });
      res.json({ message: "Данные обновлены" });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();
