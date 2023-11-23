import { object, string } from "yup";

export const schema = object({
  content: string()
    .max(50, "Subtask must be less than 500 characters")
    .required("Subtask is required"),
}).required();
