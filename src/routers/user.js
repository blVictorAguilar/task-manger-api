const express = require("express");
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const multer = require("multer");
const router = new express.Router();
const app = express();
const sharp = require("sharp");
const {
  sendRegistrationEmail,
  sendCancelationEmail,
} = require("../emails/account");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

app.use(router);

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
    const { email, name } = req.body;
    sendRegistrationEmail(email, name);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updateKeys.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid operation" });
  }

  try {
    updateKeys.forEach((element) => (req.user[element] = req.body[element]));

    await req.user.save();
    res.send(req.user);
  } catch (error) {
    return res.status(500).send();
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {}
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    const user = req.user;
    user.avatar = undefined;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      console.log("inside error");
      throw new Error();
    }
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});
module.exports = router;

//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
