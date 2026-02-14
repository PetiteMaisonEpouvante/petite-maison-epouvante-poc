const userService = require("../services/user.service");

exports.getMe = async (req, res) => {
  try {
    const sub = req.auth?.payload?.sub;
    const user = await userService.findBySub(sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.sync = async (req, res) => {
  try {
    const sub = req.auth?.payload?.sub;
    const { email, nickname, avatar } = req.body;

    if (!email) return res.status(400).json({ error: "email required" });

    const user = await userService.upsertFromAuth0(sub, { email, nickname, avatar });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
