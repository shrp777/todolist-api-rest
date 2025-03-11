import db from "../database";
import TaskServiceError from "../errors/TaskServiceError";
import Task from "../models/Task";
import type { TaskStatus } from "../types";

export default class TaskService {
  static findAll(): Array<Task> {
    try {
      const tasks = db.query("SELECT * FROM tasks").as(Task).all();
      return tasks;
    } catch (error) {
      throw new TaskServiceError(`Database error`);
    }
  }

  static async findOneById(id: string): Promise<Task | null> {
    try {
      const task = db
        .query("SELECT * FROM tasks WHERE id = ?")
        .as(Task)
        .get(id!);
      if (!task) throw new TaskServiceError(`Task ${id} does not exist`);
      else return task;
    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      else throw new TaskServiceError(`Database error`);
    }
  }

  static async update(id: string, task: Task): Promise<Task | undefined> {
    const existing = await this.findOneById(id);

    const now = new Date().toISOString();

    if (!existing) {
      const insert = db.prepare(
        "INSERT INTO tasks (id, content, status, createdAt, completedAt, deadline) VALUES ($id,$content,$status,$createdAt,$completedAt,$deadline)"
      );

      const insertTasks = db.transaction((tasks) => {
        for (const task of tasks) insert.run(task);
        return tasks.length;
      });

      const count = insertTasks([
        {
          $id: id,
          $content: task.content,
          $status: "todo",
          $createdAt: now,
          $completedAt: null,
          $deadline: task.deadline
        }
      ]);

      console.log(`Inserted ${count} tasks`);
    } else {
      const update = db.prepare(
        "UPDATE tasks SET content = $content, status = $status, completedAt = $completedAt, deadline = $deadline WHERE id = $id"
      );

      const updateTasks = db.transaction((tasks) => {
        for (const task of tasks) update.run(task);
        return tasks.length;
      });

      let completedAt = null;
      const now = new Date().toISOString();

      if (task.status === "done") {
        completedAt = existing.completedAt || now;
      } else {
        completedAt = null;
      }

      const count = updateTasks([
        {
          $content: task.content ?? existing.content,
          $status: task.status ?? existing.status,
          $completedAt: completedAt,
          $deadline: task.deadline ?? existing.deadline,
          $id: id
        }
      ]);

      const updatedTask = db
        .query(`SELECT * FROM tasks WHERE id = $id`)
        .as(Task)
        .get(id!);
    }

    return undefined;
  }

  static async updateStatus(
    id: string,
    status: TaskStatus = "todo"
  ): Promise<Task | undefined> {
    const existing = await this.findOneById(id);

    const now = new Date().toISOString();

    if (!existing) {
      const updateTaskStatus = db.prepare(`
          UPDATE tasks SET status = $status, updatedAt = $updatedAt WHERE id = $id
        `);

      updateTaskStatus.run(status, now, id);
    }
    return undefined;
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const existing = await this.findOneById(id);

      if (!existing) throw new TaskServiceError(`Task does not exist`);

      const statement = db.prepare("DELETE FROM tasks WHERE id = $id");

      const result = statement.run(id!);

      return true;
    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      else throw new TaskServiceError(`Database error`);
    }
  }

  static async create(task: Task): Promise<Task> {
    return new Task();
  }
}
