import { get, post } from '@/utils/request'
import { Paragraph } from '@/types/system'

const Api = {
  listParagraphByPaper: '/paragraph/list-by-paper',
  updateAvailable: '/paragraph/update-available',
}

export function listParagraphByPaper(paperId: string) {
  return get<Paragraph[]>(Api.listParagraphByPaper, { params: { paperId } })
}

export function updateParagraphAvailable(
  paragraphId: string,
  available: boolean,
) {
  return post<boolean>(Api.updateAvailable, null, {
    params: { paragraphId, available },
  })
}
