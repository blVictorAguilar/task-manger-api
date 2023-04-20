const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task.model");
const {
  userOne,
  userTwo,
  setupDatabase,
  taskOne,
  taskTwo,
} = require("./fixtures/db");
beforeEach(setupDatabase);
test("Should get profile for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Test from jest",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

test("Should not delete other users tasks", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
