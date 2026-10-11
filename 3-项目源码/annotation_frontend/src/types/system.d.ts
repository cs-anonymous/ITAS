export interface ResultModel<T> {
  code: number
  msg: string
  payload: T
}

export interface PageModel<T> {
  pageNum: number
  pageSize: numner
  total: number
  records: T[]
}

export interface User {
  id: string
  username: string
  realName: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export interface OssFile {
  id: string
  filename: string
  objectName: string
  bucket: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  introduction: string
  attachmentId: string
  attachmentName: string
  assigned: boolean
  assignedAt: string
  createdAt: string
  updatedAt: string
}

export interface Paper {
  id: string
  projectId: string
  identifier: string
  filename: string
  pdfId: string
  htmlId: string
  txtId: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  projectId: string
  tagKey: string
  tagName: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  projectId: string
  paperId: string
  identifier: string
  userId: string
  userRealName: string
  pdfId: string
  htmlId: string
  txtId: string
  finished: boolean
  createdAt: string
  updatedAt: string
}

export interface Label {
  id: string
  taskId: string
  content: string
  tagId: string
  remark: string
  location: string
  start: number
  end: number
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string
}
