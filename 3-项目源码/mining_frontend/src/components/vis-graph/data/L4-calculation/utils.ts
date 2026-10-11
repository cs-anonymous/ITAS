// 移除字符串中的特殊字符
export const removeSpecialCharacters = (str: string) => {
  return str.replace(/[^\w()[\]{}]/g, '')
}
