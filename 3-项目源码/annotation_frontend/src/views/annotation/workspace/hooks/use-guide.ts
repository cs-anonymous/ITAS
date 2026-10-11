import { ref, Ref } from 'vue'
import type { GuideStep } from 'tdesign-vue-next'

function useGuide(tabsKey: Ref<string>) {
  const currentStep = ref(0)
  if (
    localStorage.getItem('annotation-guide-skip') &&
    JSON.parse(localStorage.getItem('annotation-guide-skip')!)
  ) {
    currentStep.value = -1
  }
  const showGuide = () => {
    currentStep.value = 0
  }
  const steps: GuideStep[] = [
    {
      element: '#annotation-frame',
      title: '使用说明',
      body: '按住鼠标左键在标注文本中滑动选择标注词。',
      placement: 'right',
    },
    {
      element: '#annotation-tabs',
      title: '标注选择',
      body: '选择标注词的所属类别并添加备注，点击按钮提交。',
      placement: 'left',
    },
    {
      element: '#annotation-tabs',
      title: '已标数据',
      body: '在此查看已标注的数据，可进行修改和删除，点击标注词跳转到文本相应位置。',
      placement: 'left',
    },
    {
      element: '#annotation-tabs',
      title: '数据统计',
      body: '在此查看标注文本信息和各标签的统计数据。',
      placement: 'left',
    },
    {
      element: '.tool-box',
      title: '文本放缩',
      body: '通过此组按钮放大或缩小标注文本。',
      placement: 'bottom',
    },
    {
      element: '#prefer-btn',
      title: '偏好设置',
      body: '文本页面宽度比例、标注颜色显示等在此设置。',
      placement: 'bottom',
    },
    {
      element: '.finish-btn',
      title: '完成标注',
      body: '标注完成后，点此切换任务状态，以便管理员查看完成情况。',
      placement: 'bottom',
    },
  ]
  const onStepChange = (current: number) => {
    if (current == 1) {
      tabsKey.value = 'selector'
    } else if (current == 2) {
      tabsKey.value = 'data'
    } else if (current == 3) {
      tabsKey.value = 'statistic'
    }
  }
  const onSkip = () => {
    localStorage.setItem('annotation-guide-skip', JSON.stringify(true))
    currentStep.value = -1
  }

  return {
    currentStep,
    steps,
    showGuide,
    onStepChange,
    onSkip,
  }
}

export { useGuide }
