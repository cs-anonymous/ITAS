import { get, post } from '@/utils/request'
import { PageModel, PageParams, Project } from '@/types/system'

const Api = {
  createProject: '/project/create',
  updateProject: '/project/update',
  pageAllProject: '/project/page-all',
  getProjectById: '/project/get',
  quickStart: '/project/quick-start',
}

export function createProject(params: ProjectInfoParams) {
  return post<Project>(Api.createProject, params)
}

export function updateProject(id: string, params: ProjectInfoParams) {
  return post<null>(Api.updateProject, params, { params: { id } })
}

export function pageAllProject(params: PageParams) {
  return get<PageModel<Project>>(Api.pageAllProject, { params: params })
}

export function getProjectById(id: string) {
  return get<Project>(Api.getProjectById, {
    params: {
      projectId: id,
    },
  })
}

export function quickStart(form: FormData) {
  return post<Project>(Api.quickStart, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 3 * 60 * 1000,
  })
}

interface ProjectInfoParams {
  name: string
  introduction: string
}
