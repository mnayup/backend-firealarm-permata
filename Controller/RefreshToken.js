import Users from "../Models/UserModels.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  // console.log("CEK BE");
  // console.log(req.query);

  try {
    // const refreshToken = req.cookies.refreshToken;
    const refreshToken = req.query;
    console.log(refreshToken, ">?>>>>>>");
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken.token,
      },
    });

    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken.token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const name = user[0].name;
        const username = user[0].username;
        const accessToken = jwt.sign(
          { userId, name, username },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
