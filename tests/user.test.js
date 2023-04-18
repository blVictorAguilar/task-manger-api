const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Victor",
  email: "victor@gmail.com",
  password: "7isLongEnough",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};
beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("ShouldSignup", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "victorrrr",
      email: "blashyrkh1579@gmail.com",
      password: "7isLongEnough",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "victorrrr",
      email: "blashyrkh1579@gmail.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("7isLongEnough");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should not delete profile for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should  delete profile for user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      name: userOne.name,
    })
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual(userOne.name);
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      name: userOne.name,
    })
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual(userOne.name);
});

test("Should  not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      location: userOne.name,
    })
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(400);
});
