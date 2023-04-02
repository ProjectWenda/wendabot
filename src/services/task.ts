import axios from "axios";
import { getUserUID } from "./auth";

const BASE_URL = process.env.LOCAL_BACKEND_URL;

export type TasksResponse = {
  [taskDate : string]: {
    tasks: [
      {
        taskID: string,
        discordID: string,
        timeCreated: string,
        lastModified: string,
        content: string,
        taskStatus: number,
        taskDate: string
      }
    ]
  }
}

export const getTasks = async (discordName: string, discordID: string) : Promise<TasksResponse> => {
  const userUID = await getUserUID(discordName, discordID);
  const response = await axios.get(`${BASE_URL}/tasks`, { params: { uid: userUID } });
  return response.data;
};

// export const addTask = async (args: AddTaskArgs) => {
//   const response = await axios.post(`${BASE_URL}/task?uid=${args.uid}`, args.taskData);
//   return tasksFromServer([response.data])[0];
// };

// export const deleteTask = async (args : DeleteTaskArgs) : Promise<Task | null> => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/task`, { params: args });
//     return tasksFromServer([response.data])[0];
//   } catch (e) {
//     return null;
//   }
// }

// export const editTask = async (args: EditTaskArgs) : Promise<Task | null> => {
//   try {
//     const response = await axios.put(`${BASE_URL}/task`, null, { params: args });
//     return tasksFromServer([response.data])[0];
//   } catch (e) {
//     return null;
//   }
// }