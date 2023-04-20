const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user.model");
const Task = require("../../src/models/task.model");

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
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Blashyrkh",
  email: "blashyrkh@gmail.com",
  password: "7isLongEnough",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOneId = new mongoose.Types.ObjectId();

const taskOne = {
  _id: taskOneId,
  description: "First Task",
  completed: false,
  owner: userOneId._id,
};

const taskTwoId = new mongoose.Types.ObjectId();
const taskTwo = {
  _id: taskTwoId,
  description: "First Task",
  completed: false,
  owner: userOneId._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "First Task",
  completed: false,
  owner: userTwo._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  setupDatabase,
  userOne,
  userTwo,
  userOneId,
  taskOne,
  taskTwo,
};
