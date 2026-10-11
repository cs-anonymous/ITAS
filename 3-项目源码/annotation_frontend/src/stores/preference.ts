import { defineStore } from 'pinia'
import { useAnnotationStore } from './annotation'

interface PreferenceState {
  colorList: { name: string; value: string }[]
  frameCol: number
  keepTagAfterLabeling: boolean
  showRemarkInDataTable: boolean
}

export const usePreferenceStore = defineStore('preference', {
  state: (): PreferenceState => ({
    colorList: [
      {
        name: 'highlight-color-1',
        value: '#fff200',
      },
      {
        name: 'highlight-color-2',
        value: '#ffb3bf',
      },
      {
        name: 'highlight-color-3',
        value: '#a6ffa6',
      },
      {
        name: 'highlight-color-4',
        value: '#e1c9f8',
      },
      {
        name: 'highlight-color-5',
        value: '#ffc966',
      },
      {
        name: 'highlight-color-6',
        value: '#81d6fd',
      },
      {
        name: 'highlight-color-7',
        value: '#c5b1a0',
      },
      {
        name: 'highlight-color-8',
        value: '#6697e5',
      },
      {
        name: 'highlight-color-9',
        value: '#62b771',
      },
    ],
    frameCol: 7,
    keepTagAfterLabeling: true,
    showRemarkInDataTable: true,
  }),
  getters: {
    otherCol(state) {
      return 12 - state.frameCol
    },
    tagColor(state) {
      const annotationStore = useAnnotationStore()
      const list = annotationStore.tagList.map((item) => {
        return {
          id: item.id,
          tagName: item.tagName,
          colorName: state.colorList[state.colorList.length - 1].name,
          colorValue: state.colorList[state.colorList.length - 1].value,
        }
      })
      for (let i = 0; i < list.length; i++) {
        if (i < state.colorList.length) {
          list[i].colorName = state.colorList[i].name
          list[i].colorValue = state.colorList[i].value
        }
      }
      return (id: string) => list.find((l) => l.id === id)
    },
    presetColors() {
      return [
        '#fff200',
        '#ffb3bf',
        '#a6ffa6',
        '#e1c9f8',
        '#ffc966',
        '#81d6fd',
        '#c5b1a0',
        '#6697e5',
        '#62b771',
      ]
    },
  },
  actions: {},
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }],
  },
})
