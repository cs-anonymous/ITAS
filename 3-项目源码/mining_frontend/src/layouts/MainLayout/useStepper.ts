import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useStepper() {
  const steps = [
    {
      value: 1,
      title: '合成段落识别',
      pathName: 'SynthParagraphRecog',
    },
    {
      value: 2,
      title: '识别结果评价',
      pathName: 'RecognitionFeedback',
    },
    {
      value: 3,
      title: '合成参数预测',
      pathName: 'SynthParameterPredict',
    },
  ]
  const route = useRoute()
  const currentStep = computed(
    () => steps.find((s) => s.pathName === route.matched[1].name)?.value || 1,
  )
  return {
    steps,
    currentStep,
  }
}
