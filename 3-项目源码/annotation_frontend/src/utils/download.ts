export function saveDownload(b: Blob, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.style.display = 'none'
  link.href = URL.createObjectURL(new Blob([b]))
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
