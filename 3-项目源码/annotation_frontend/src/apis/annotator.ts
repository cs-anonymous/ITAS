import { get, post } from '@/utils/request'
import { PageModel, User } from '@/types/system'

const Api = {
  addAnnotator: '/annotator/add',
  removeAnnotator: '/annotator/remove',
  pageAnnotator: '/annotator/page',
  getAllAnnotatorIds: '/annotator/get-all-ids',
}

export function addAnnotator(id: string, userIds: string[]) {
  return post<string[]>(Api.addAnnotator, userIds, {
    params: { projectId: id },
  })
}

export function removeAnnotator(id: string, userIds: string[]) {
  return post<string[]>(Api.removeAnnotator, userIds, {
    params: { projectId: id },
  })
}

export function pageAnnotator(params: PageAnnotatorParams) {
  return get<PageModel<User>>(Api.pageAnnotator, { params: params })
}

export function getAllAnnotatorIds(projectId: string) {
  return get<string[]>(Api.getAllAnnotatorIds, { params: { projectId } })
}

interface PageAnnotatorParams {
  projectId: string
  pageNum: number
  pageSize: number
}
