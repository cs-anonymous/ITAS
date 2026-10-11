import { get, post } from '@/utils/request'
import { PageModel, Task } from '@/types/system'

const Api = {
  getStatistic: '/task/statistic',
  assignTask: '/task/assign',
  pageAllTask: '/task/page-all',
  pageMyTask: '/task/page-my',
  getTaskById: '/task/get',
  changeFinished: '/task/change-finished',
}

export function getStatistic(projectId: string) {
  return get<ProjectStatisticReturnData>(Api.getStatistic, {
    params: { projectId },
  })
}

export function assignTask(params: AssignTaskParams) {
  return post<boolean>(Api.assignTask, null, { params: params })
}

export function pageAllTask(params: PageTaskParams) {
  return get<PageModel<Task>>(Api.pageAllTask, { params: params })
}

export function pageMyTask(params: PageTaskParams) {
  return get<PageModel<Task>>(Api.pageMyTask, { params: params })
}

export function getTaskById(id: string) {
  return get<Task>(Api.getTaskById, { params: { taskId: id } })
}

export function changeFinished(taskId: string) {
  return post<boolean>(Api.changeFinished, null, { params: { taskId } })
}

interface ProjectStatisticReturnData {
  annotatorCount: number
  paperCount: number
  tagCount: number
  taskCount: number
  finishedTaskCount: number
}

interface AssignTaskParams {
  projectId: string
  threshold: number
}

interface PageTaskParams {
  projectId: string
  pageNum: number
  pageSize: number
}
