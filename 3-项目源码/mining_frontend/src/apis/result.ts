import { get } from '@/utils/request'
import { ExtractResult } from '@/types/system'

const Api = {
  listResultByTask: '/extract/list-by-task',
}

export function listResultByTask(taskId: string) {
  return get<ExtractResult[]>(Api.listResultByTask, { params: { taskId } })
}
