import { PageModel, PageParams, Paper } from '@/types/system'
import { post, get } from '@/utils/request'

const Api = {
  uploadPaper: '/paper/upload',
  pagePaper: '/paper/page',
  removePaper: '/paper/remove',
  listFinishPaperByProject: '/paper/list-finish-by-project',
  getPaperById: '/paper/get',
  listPaperByProject: '/paper/list-by-project',
}

export function uploadPaper(form: FormData) {
  return post<void>(Api.uploadPaper, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 3 * 60 * 1000,
  })
}

export function pagePaper(params: PagePaperParams) {
  return get<PageModel<Paper>>(Api.pagePaper, { params })
}

export function removePaper(ids: string[]) {
  return post<boolean>(Api.removePaper, ids)
}

export function listFinishPaperByProject(projectId: string) {
  return get<Paper[]>(Api.listFinishPaperByProject, { params: { projectId } })
}

export function getPaperById(id: string) {
  return get<Paper>(Api.getPaperById, { params: { id } })
}

export function listPaperByProject(projectId: string) {
  return get<Paper[]>(Api.listPaperByProject, { params: { projectId } })
}

interface PagePaperParams extends PageParams {
  projectId: string
}
