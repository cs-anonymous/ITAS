import { PaperStatus } from './enum'

export interface ResultModel<T> {
  code: number
  msg: string
  payload: T
}

export interface PageModel<T> {
  pageNum: number
  pageSize: numner
  total: number
  totalPage: number
  records: T[]
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
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

export interface Paper {
  id: string
  projectId: string
  filename: string
  pdfId: string
  htmlId: string
  txtId: string
  status: PaperStatus
  createdAt: string
  updatedAt: string
}

export interface Paragraph {
  id: string
  projectId: string
  paperId: string
  paperName: string
  content: string
  available: boolean
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  projectId: string
  name: string
  model: string
  size: number
  createdAt: string
  temperature: number
  sampling: string
  paperCount: number
  paraCount: number
}

export interface ExtractResult {
  id: string
  taskId: string
  paragraphId: string
  paragraphContent: string
  status: number
  results: ExtractRecordVO
  prompt: promptVO[]
  tags: number
  count: number
  paraLength: number
  paperName: string
  markedResults: MarkedRecordVO
}

export interface ExtractRecordVO {
  paragraphId: string
  param: Record<string, string[]>
}
export interface MarkedRecordVO {
  mofId: string
  param: Record<string, string[]>
}

export interface promptVO {
  role: string
  content: string
}

export interface PageParams {
  pageNum: number
  pageSize: number
}
