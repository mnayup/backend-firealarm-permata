import Users from "../Models/UserModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*Menampilkan User*/
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "username"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

/*Registrasi*/
export const Register = async (req, res) => {
  const { name, username, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak Cocok" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hashSync(password, salt);
  try {
    await Users.create({
      name: name,
      username: username,
      password: hashPassword,
    });
    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
  }
};

/*Login*/
export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        username: req.body.username,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });
    const userId = user[0].id;
    const name = user[0].name;
    const username = user[0].username;
    const accessToken = jwt.sign(
      { userId, name, username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "40s",
      }
    );

    // await Users.update(
    //   { refresh_token: refreshToken },
    //   {
    //     where: {
    //       id: userId,
    //     },
    //   }
    // );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });
    res.json({
      accessToken,
      // data: {
      //   accessToken: accessToken,
      //   refreshToken: refreshToken,
      // },
    });
  } catch (error) {
    res.status(404).json({ msg: "Username Tidak Ditemukan" });
  }
};

/*Logout*/
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

/*Update Password*/
// export const Update = async (req, res) => {
//   try {
//     let nama = localStorage.getItem("nama");
//     console.log(nama);
//     let { password } = req.body;
//     console.log(password);
//     let cekPasswordLama = await Users.findAll({
//       where: {
//         password: password,
//       },
//     });
//     const match = await bcrypt.compare(req.body.password, user[0].password);
//     if (!match) return res.status(400).json("Password Salah");
//   } catch (error) {}
// };

/* Cek Password Lama */
export const CekPasswordLama = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        name: req.body.name,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });
    res.status(200).json({
      msg:"Match.......!afalk!!!"
    });
  } catch (error) {
    res.status(404).json({ msg: "Username Tidak Ditemukan" });
  }
};

/* Ganti Password */
export const GantiPassword = async (req, res) => {
  const {name, password} = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hashSync(password, salt);
  try {
    await Users.update(
      {
        password: hashPassword,
      },
      {
        where: {
          name: name,
        },
      }
    )
  
  res.json({
    data: req.body,
    msg: "Berhasil Mengubah Password",
  })

  } catch (error) {
    res.status(404).json({ msg: "Tidak Dapat Terhubung Ke Database" });
  }
};