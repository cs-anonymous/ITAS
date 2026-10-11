import { get, post } from '@/utils/request'
import type { Label } from '@/types/system'

const Api = {
  createLabel: '/label/create',
  listLabelsByTask: '/label/list-by-task',
  listLabelsByPaper: '/label/list-by-paper',
  editLabel: '/label/edit',
  deleteLabel: '/label/delete',
}

export function createLabel(taskId: string, params: CreateLabelParams) {
  return post<Label>(Api.createLabel, params, { params: { taskId } })
}

export function listLabelsByTask(taskId: string) {
  return get<Label[]>(Api.listLabelsByTask, { params: { taskId } })
}

export function editLabel(id: string, params: EditLabelParams) {
  return post<boolean>(Api.editLabel, params, {
    params: { id },
  })
}

export function deleteLabel(id: string) {
  return post<boolean>(Api.deleteLabel, null, { params: { id } })
}

export function listLabelsByPaper(paperId: string) {
  return get<Label[]>(Api.listLabelsByPaper, { params: { paperId } })
}

interface CreateLabelParams {
  content: string
  tagId: string
  remark: string
  location: string
  start: number
  end: number
}

interface EditLabelParams {
  tagId?: string
  remark?: string
}
