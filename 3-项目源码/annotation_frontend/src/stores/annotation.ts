import { defineStore } from 'pinia'
import type { Tag, Label } from '@/types/system'
import { createLabel, editLabel, deleteLabel } from '@/apis/label'
import type { RangySelectionBookmark } from '@/types/rangy'
import { pullAt, countBy, defaultTo } from 'lodash'

interface AnnotationState {
  taskId: string
  tagList: Tag[]
  currentLabel: Pick<
    PresentLabel,
    'content' | 'tagId' | 'remark' | 'bookmark' | 'location'
  >
  scrollBookmark: RangySelectionBookmark | null
  presentLabelList: PresentLabel[]
}

interface PresentLabel {
  id: string
  content: string
  tagId: string
  remark: string
  location: string
  bookmark: RangySelectionBookmark | null
  serializeError: boolean
  creatorId: string
  creatorName: string
}

export const useAnnotationStore = defineStore('annotation', {
  state: (): AnnotationState => ({
    taskId: '',
    tagList: [],
    currentLabel: {
      content: '',
      tagId: '',
      remark: '',
      location: '',
      bookmark: null,
    },
    scrollBookmark: null,
    presentLabelList: [],
  }),
  getters: {
    countByTag(state) {
      const countMap = countBy(state.presentLabelList, 'tagId')
      return state.tagList.map((tag) => ({
        tagId: tag.id,
        content: tag.tagName,
        count: defaultTo(countMap[tag.id], 0),
      }))
    },
  },
  actions: {
    setPresentLabelList(labels: Label[]) {
      this.presentLabelList = labels.map((l) => convertLabel2PresentLabel(l))
    },
    addLabel() {
      return new Promise((resolve, reject) => {
        if (
          this.taskId.length > 0 &&
          this.currentLabel.content.length > 0 &&
          this.currentLabel.tagId.length > 0 &&
          this.currentLabel.location.length > 0 &&
          this.currentLabel.bookmark != null
        ) {
          createLabel(this.taskId, {
            content: this.currentLabel.content,
            tagId: this.currentLabel.tagId,
            remark: this.currentLabel.remark,
            location: this.currentLabel.location,
            start: this.currentLabel.bookmark.rangeBookmarks[0].start,
            end: this.currentLabel.bookmark.rangeBookmarks[0].end,
          })
            .then((res) => {
              if (res.payload) {
                const presentLabel = convertLabel2PresentLabel(res.payload)
                presentLabel.bookmark = this.currentLabel.bookmark
                this.presentLabelList.push(presentLabel)
                this.currentLabel = {
                  content: '',
                  tagId: '',
                  remark: '',
                  location: '',
                  bookmark: null,
                }
                resolve(res.payload)
              } else {
                reject()
              }
            })
            .catch(reject)
        } else {
          reject()
        }
      })
    },
    updateLabel(id: string, params: { tagId?: string; remark?: string }) {
      return new Promise((resolve, reject) => {
        editLabel(id, params)
          .then((res) => {
            if (res.payload) {
              const index = this.presentLabelList.findIndex((l) => l.id === id)
              if (index != -1) {
                if (params.tagId) {
                  this.presentLabelList[index].tagId = params.tagId
                }
                if (params.remark != undefined) {
                  this.presentLabelList[index].remark = params.remark
                }
              }
              resolve(res)
            } else {
              reject()
            }
          })
          .catch(reject)
      })
    },
    removeLabel(id: string) {
      return new Promise((resolve, reject) => {
        deleteLabel(id)
          .then((res) => {
            if (res.payload) {
              const index = this.presentLabelList.findIndex((l) => l.id === id)
              if (index != -1) {
                pullAt(this.presentLabelList, index)
              }
              resolve(res)
            } else {
              reject()
            }
          })
          .catch(reject)
      })
    },
  },
})

const convertLabel2PresentLabel = (label: Label): PresentLabel => {
  return {
    id: label.id,
    content: label.content,
    location: label.location,
    bookmark: null,
    remark: label.remark,
    tagId: label.tagId,
    creatorId: label.creatorId,
    creatorName: label.creatorName,
    serializeError: false,
  }
}
