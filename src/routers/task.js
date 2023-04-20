const express = require("express");
const Task = require("../models/task.model");
const auth = require("../middleware/auth");

const router = new express.Router();
const app = express();
app.use(router);

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    console.log("sort: ", sort);
    const options = {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort,
    };

    await req.user.populate({
      path: "tasks",
      match,
      options,
    });

    console.log(req.user.tasks);
    res.status(200).send(req.user.tasks);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const response = await Task.findOne({ _id, owner: req.user._id });
    if (!response) {
      res.status(404).send("No records...");
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const _id = req.params.id;

  const isValidOperation = updateKeys.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid operation" });
  }
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    updateKeys.forEach((update) => (task[update] = req.body[update]));

    await task.save();
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    return res.status(500).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const response = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!response) {
      return res.status(404).send("no task found");
    }
    res.status(200).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
