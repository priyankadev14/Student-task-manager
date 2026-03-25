const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Learn:UfP7RTZmtfWD5ofJ@learn.uejsadu.mongodb.net/taskManager",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema
const taskSchema = new mongoose.Schema({
  title: String,
  status: { type: String, default: "pending" },
});

const Task = mongoose.model("Task", taskSchema);

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add task
app.post("/tasks", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Mark complete
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: "completed" },
    { new: true },
  );
  res.json(task);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
