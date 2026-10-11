import { Paragraph } from '@/types/system'
import { ref } from 'vue'
import { listParagraphByPaper } from '@/apis/paragraph'

export function useParagraphList() {
  const paragraphList = ref<Paragraph[]>([])
  const paragraphLoading = ref(false)
  const getParagraphList = (id: string) => {
    paragraphLoading.value = true
    listParagraphByPaper(id)
      .then((res) => {
        paragraphList.value = res.payload
      })
      .finally(() => {
        paragraphLoading.value = false
      })
  }
  return {
    paragraphLoading,
    paragraphList,
    getParagraphList,
  }
}
