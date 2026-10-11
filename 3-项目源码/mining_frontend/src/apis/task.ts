import { get, post } from '@/utils/request'
import { Task } from '@/types/system'

const Api = {
  listTaskByProject: '/task/list-by-project',
  createTask: '/task/create',
  getTaskById: '/task//get-task-by-id',
}

export function listTaskByProject(projectId: string) {
  return get<Task[]>(Api.listTaskByProject, { params: { projectId } })
}

export function createTask(params: CreateTaskParams) {
  return post<Task>(Api.createTask, params)
}

export function getTaskById(taskId: string) {
  return get<Task>(Api.getTaskById, { params: { taskId } })
}

interface CreateTaskParams {
  size: number
  model: string
  projectId: string
  temperature: number
}
