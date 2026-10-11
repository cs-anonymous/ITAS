import { PageModel, Paper } from '@/types/system'
import { post, get } from '@/utils/request'
import { UploadFile } from 'tdesign-vue-next'

const Api = {
  uploadPaper: '/paper/upload',
  pagePaper: '/paper/page',
  updateIdentifier: '/paper/update-identifier',
  removePaper: '/paper/remove',
  checkIdentifier: '/paper/check-identifier',
  listPaperByProject: '/paper/list-by-project',
  getPaperById: '/paper/get',
}

export function uploadPaper(projectId: string, files: UploadFile[]) {
  const form = new FormData()
  form.append('projectId', projectId)
  files.forEach((f) => {
    form.append('files', f.raw!)
  })
  return post<void>(Api.uploadPaper, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 3 * 60 * 1000,
  })
}

export function pagePaper(params: PagePaperParams) {
  return post<PageModel<Paper>>(Api.pagePaper, params)
}

export function updateIdentifier(params: UpdateIdentifierParams) {
  return post<boolean>(Api.updateIdentifier, null, {
    params: params,
  })
}

export function removePaper(ids: string[]) {
  return post<boolean>(Api.removePaper, ids)
}

export function checkIdentifier(projectId: string) {
  return get<string[]>(Api.checkIdentifier, { params: { projectId } })
}

export function listPaperByProject(projectId: string) {
  return get<Paper[]>(Api.listPaperByProject, { params: { projectId } })
}

export function getPaperById(id: string) {
  return get<Paper>(Api.getPaperById, { params: { id } })
}

interface PagePaperParams {
  projectId: string
  pageNum: number
  pageSize: number
  identifier?: string
  status?: number
  sortField?: string
  sortDescending?: boolean
}

interface UpdateIdentifierParams {
  id: string
  identifier: string
}
