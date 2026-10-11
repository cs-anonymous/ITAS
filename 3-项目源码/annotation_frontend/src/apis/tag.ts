import { get, post } from '@/utils/request'
import type { Tag } from '@/types/system'

const Api = {
  createTag: '/tag/create',
  listTags: '/tag/list',
  updateTag: '/tag/update',
  removeTags: '/tag/remove',
  tagKeyUnique: '/tag/tag-key-unique',
}

export function createTag(projectId: string, params: TagInfoParams) {
  return post<Tag>(Api.createTag, params, { params: { projectId } })
}

export function listTags(projectId: string) {
  return get<Tag[]>(Api.listTags, { params: { projectId } })
}

export function updateTag(id: string, params: TagInfoParams) {
  return post<void>(Api.updateTag, params, { params: { id } })
}

export function removeTags(ids: string[]) {
  return post<void>(Api.removeTags, ids)
}

export function tagKeyUnique(projectId: string) {
  return get<boolean>(Api.tagKeyUnique, { params: { projectId } })
}

interface TagInfoParams {
  tagKey: string
  tagName: string
}
