import { get, post, getFile } from '@/utils/request'
import { OssFile, PageModel, Project } from '@/types/system'
import type { UploadFile } from 'tdesign-vue-next'

const Api = {
  createProject: '/project/create',
  updateProject: '/project/update',
  pageAllProject: '/project/page-all',
  pageMyProject: '/project/page-my',
  uploadInstruction: '/project/upload-instruction',
  getProjectById: '/project/get',
  exportResult: '/export',
}

export function createProject(params: ProjectInfoParams) {
  return post<Project>(Api.createProject, params)
}

export function updateProject(id: string, params: ProjectInfoParams) {
  return post<null>(Api.updateProject, params, { params: { id } })
}

export function pageAllProject(params: PageProjectParams) {
  return get<PageModel<Project>>(Api.pageAllProject, { params: params })
}

export function uploadInstruction(file: UploadFile) {
  const form = new FormData()
  form.append('file', file.raw!)
  return post<OssFile>(Api.uploadInstruction, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 20 * 1000,
  })
}

export function getProjectById(id: string) {
  return get<Project>(Api.getProjectById, {
    params: {
      projectId: id,
    },
  })
}

export function pageMyProject(params: PageProjectParams) {
  return get<PageModel<Project>>(Api.pageMyProject, { params: params })
}

export function exportResult(projectId: string) {
  return getFile<Blob>(Api.exportResult, {
    params: { projectId },
    responseType: 'blob',
    timeout: 30 * 1000,
  })
}

interface ProjectInfoParams {
  name: string
  introduction: string
  attachmentId?: string
  attachmentName?: string
}

interface PageProjectParams {
  pageNum: number
  pageSize: number
}
