export interface RangyRangeBookmark {
  containerNode: Node
  start: number
  end: number
}

export interface RangySelectionBookmark {
  backward: boolean
  rangeBookmarks: RangyRangeBookmark[]
}
