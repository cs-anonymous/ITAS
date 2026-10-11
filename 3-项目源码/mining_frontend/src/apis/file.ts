import { getFile } from '@/utils/request'
import { AxiosProgressEvent } from 'axios'

const Api = {
  download: '/file/download',
}

export function download(
  id: string,
  onDownloadProgressCb?: (p: number) => void,
) {
  return getFile<Blob>(Api.download, {
    params: { id },
    responseType: 'blob',
    timeout: 60 * 1000,
    onDownloadProgress: onDownloadProgressCb
      ? (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            )
            onDownloadProgressCb(progress)
          }
        }
      : undefined,
  })
}
