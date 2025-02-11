export default class Task {
  id?: string;
  content: string = "";
  status: "todo" | "doing" | "done" = "todo";
  createdAt?: Date;
  completedAt?: Date;
  deadline?: Date;
}
