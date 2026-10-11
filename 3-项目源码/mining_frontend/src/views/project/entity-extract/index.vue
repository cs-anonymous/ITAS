<template>
  <div class="pl-2 pr-2">
    <!--  Row 1  -->
    <v-row>
      <div style="width: 100%">
        <v-card variant="flat" style="width: 100%">
          <template #title>
            <span
              style="font-style: italic; color: #1a66c0; font-size: larger"
              >{{ curTask?.name }}</span
            ><span style="font-weight: normal; font-size: medium"
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 模型 :
              <span style="color: #1a66c0">{{ curTask?.model }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;随机性 :
              <span style="color: #1a66c0">{{ curTask?.temperature }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;样本选择 :
              <span style="color: #1a66c0">{{ curTask?.sampling }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;样本 :
              <span style="color: #1a66c0">{{ curTask?.size }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;论文 :
              <span style="color: #1a66c0">{{ curTask?.paperCount }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;成功抽取/已选取 :
              <span style="color: #1a66c0"
                >{{ resultList?.length }}/{{ curTask?.paraCount }}</span
              ></span
            >
          </template>
          <template v-slot:append>
            <v-btn
              color="primary"
              variant="text"
              @click="downloadResults"
              size="large"
            >
              下载抽取结果
            </v-btn>
            <v-btn
              color="secondary"
              class="ml-4"
              @click="prevStep"
              size="large"
            >
              上一步
            </v-btn>
          </template>
        </v-card>
      </div>
    </v-row>
    <!--  Row 2  -->
    <v-row>
      <v-col>
        <div class="bento-box">
          <General :total="general_metrics" />

          <v-tabs v-model="metrics_tab" align-tabs="start" :grow="true">
            <v-tab value="overview">Overall Performance</v-tab>
            <v-tab value="detail">By Synthesis Conditions</v-tab>
            <v-tab value="scatter-plot">Data Distribution</v-tab>
          </v-tabs>

          <v-window v-model="metrics_tab">
            <v-window-item value="overview">
              <HeatMap :data="params_metrics" />
            </v-window-item>
            <v-window-item
              value="detail"
              style="max-height: 50vh; overflow-y: scroll; overflow-x: hidden"
            >
              <ParamsMetrics :param_data="params_metrics" />
            </v-window-item>
            <v-window-item value="scatter-plot">
              <ScatterPlot :ready="vis_data_ready" />
            </v-window-item>
          </v-window>
        </div>
      </v-col>
    </v-row>

    <!--  Row 3  -->
    <v-row>
      <v-col>
        <div
          class="bento-box-bottom"
          style="
            max-height: 70vh;
            overflow-y: scroll;
            overflow-x: hidden;
            position: relative;
          "
        >
          <v-row class="select-position" style="margin-bottom: 1rem">
            <v-col :cols="8">
              <div>
                <v-radio-group inline v-model="sequence">
                  <v-radio label="合成段长度升序" value="shortToLong"></v-radio>
                  <v-radio label="合成段长度降序" value="longToShort"></v-radio>
                  <v-radio
                    label="参数种类升序"
                    value="typeLessToMore"
                  ></v-radio>
                  <v-radio
                    label="参数种类降序"
                    value="typeMoreToLess"
                  ></v-radio>
                  <v-radio label="参数个数升序" value="lessToMore"></v-radio>
                  <v-radio label="参数个数降序" value="moreToLess"></v-radio>
                </v-radio-group>
              </div>
            </v-col>
            <v-col :cols="4" class="d-flex pr-3">
              <v-btn-toggle
                v-model="selected"
                color="primary"
                rounded="l"
                group
              >
                <v-btn value="all"> 全选 </v-btn>
                <v-btn value="none"> 全不选 </v-btn>
                <v-btn value="customize"> 自定义前{{ customize }}项 </v-btn>
              </v-btn-toggle>
              <span
                class="ml-2"
                style="display: inline-block; margin-top: 12px; font-size: 15px"
              >
                自定义项数：
              </span>
              <v-text-field
                variant="outlined"
                v-model="customize"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            style="margin-bottom: 2rem"
            v-for="(pa, idx) in resultList"
            :key="idx"
          >
            <v-col :cols="5" class="pr-4">
              <div style="height: 100%">
                <v-card
                  class="mb-3"
                  variant="outlined"
                  hover
                  style="height: 100%"
                  :title="pa.paperName"
                >
                  <template #append>
                    <v-checkbox-btn
                      v-model="selectedPara"
                      :value="pa"
                    ></v-checkbox-btn>
                  </template>
                  <template #subtitle>合成段落{{ idx + 1 }}</template>
                  <template #text>{{ pa.paragraphContent }}</template>
                </v-card>
              </div>
            </v-col>
            <v-col :cols="7" v-loading="resultLoading">
              <div style="height: 100%">
                <v-sheet rounded style="height: 100%">
                  <t-tooltip content="点击查看完整prompt">
                    <v-card
                      class="pa-4"
                      :elevation="4"
                      variant="tonal"
                      color="primary"
                      @click="dialog = true"
                    >
                      <div class="ellipsis">
                        <span style="font-weight: bolder; font-style: italic">
                          Prompt </span
                        >：{{ pa?.prompt[0].content }}
                      </div>
                    </v-card>
                  </t-tooltip>

                  <v-dialog v-model="dialog" width="80%">
                    <div class="prompt-cards">
                      <t-back-top
                        :visible-height="0"
                        style="position: absolute; color: white"
                        :offset="['24px', '24px']"
                        @click="dialog = false"
                        theme="primary"
                        shape="circle"
                        content="关闭"
                        size="small"
                      ></t-back-top>

                      <v-card
                        class="text-container"
                        :title="pro.role"
                        style="padding: 20px"
                        v-for="(pro, idx) in pa.prompt"
                        :key="idx"
                        variant="flat"
                        ><template v-slot:prepend>
                          <v-icon
                            :color="getIconColor(pro.role)"
                            :icon="getIcon(pro.role)"
                            size="x-large"
                          ></v-icon>
                        </template>
                        <v-card-text>
                          {{ pro?.content }}
                        </v-card-text>
                      </v-card>
                    </div>
                  </v-dialog>
                  <v-card
                    class="mt-6"
                    :elevation="4"
                    variant="tonal"
                    color="primary"
                  >
                    <v-table hover>
                      <thead>
                        <tr>
                          <th>实体类别</th>
                          <th>抽取结果</th>
                          <th v-if="pa.markedResults !== null">人工正确结果</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template
                          v-for="(item, idx) in pa?.results.param"
                          :key="idx"
                        >
                          <tr v-for="(v, i) in item" :key="i">
                            <td
                              v-if="i == 0"
                              :rowspan="item.length"
                              style="
                                color: #1a66c0;
                                font-style: italic;
                                font-weight: bolder;
                              "
                            >
                              {{ idx }}
                            </td>
                            <td
                              v-if="
                                idx == 'Metal_Source' ||
                                idx == 'Organic_Linker' ||
                                idx == 'Solvent' ||
                                idx == 'Modulator'
                              "
                            >
                              <span style="color: #1a66c0; font-style: italic">
                                precursor_name :&nbsp;
                              </span>
                              {{ getName(v) }}&nbsp;&nbsp;&nbsp;&nbsp;
                              <span style="color: #1a66c0; font-style: italic">
                                amount :&nbsp;
                              </span>
                              {{ getAmount(v) }}
                            </td>
                            <td v-else>{{ v }}</td>
                            <td v-if="pa.markedResults !== null">
                              <span
                                v-if="
                                  idx == 'Metal_Source' ||
                                  idx == 'Organic_Linker' ||
                                  idx == 'Solvent' ||
                                  idx == 'Modulator'
                                "
                              >
                                <span
                                  style="color: #1a66c0; font-style: italic"
                                  v-show="
                                    getName(
                                      getContent(
                                        pa.markedResults.param,
                                        idx,
                                        i,
                                      ),
                                    ) != null
                                  "
                                >
                                  precursor_name :&nbsp;
                                </span>
                                {{
                                  getName(
                                    getContent(pa.markedResults.param, idx, i),
                                  )
                                }}&nbsp;&nbsp;&nbsp;&nbsp;
                                <span
                                  style="color: #1a66c0; font-style: italic"
                                  v-show="
                                    getName(
                                      getContent(
                                        pa.markedResults.param,
                                        idx,
                                        i,
                                      ),
                                    ) != null
                                  "
                                >
                                  amount :&nbsp;
                                </span>
                                {{
                                  getAmount(
                                    getContent(pa.markedResults.param, idx, i),
                                  )
                                }}
                              </span>
                              <span v-else>
                                {{ getContent(pa.markedResults.param, idx, i) }}
                              </span>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-sheet>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ExtractResult } from '@/types/system'

import { watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useTaskList } from './useTaskList'
import { useResultList } from './useResultList'
import { useVisualization } from './useVisualization.ts'

import General from '@/components/vis-graph/figure/metric/General.vue'
import ParamsMetrics from '@/components/vis-graph/figure/metric/params-metrics/ParamsMetrics.vue'
import ScatterPlot from '@/components/vis-graph/figure/ScatterPlot/index.vue'
import HeatMap from '@/components/vis-graph/figure/HeatMap/index.vue'
import { MessagePlugin } from 'tdesign-vue-next'

const { curTask } = useTaskList()

const {
  resultList,
  resultLoading,
  getResultList,
  currentResult,
  selectedPara,
} = useResultList()

// 可视化数据
const { general_metrics, params_metrics, vis_data_ready, updateVisData } =
  useVisualization()

watch(selectedPara, () => {
  if (selectedPara.value) {
    console.log('⬆️ Update selectedPara', selectedPara.value)
    updateVisData(JSON.parse(JSON.stringify(selectedPara.value)))
  }
})

// 切换 tab
const metrics_tab = ref(null)

watch(curTask, () => {
  if (curTask.value) {
    getResultList(curTask.value?.id)
  }
})
const router = useRouter()
const prevStep = () => {
  router.push({
    name: 'synthesisParagraph',
  })
}

const dialog = ref(false)

//合成段选择
const selected = ref('all')
const customize = ref(5)
watch(selected, () => {
  switch (selected.value) {
    case 'all': {
      selectedPara.value = resultList.value
      break
    }
    case 'none': {
      selectedPara.value = []
      break
    }
    case 'customize': {
      selectedPara.value = resultList.value?.slice(0, customize.value)
      break
    }
    default: {
      // 可以添加一个default情况来处理未定义的sequence.value
      console.warn('Unknown selected value:', selected.value)
      break
    }
  }
})

// 合成段排序
const sequence = ref('')
watch(sequence, () => {
  switch (sequence.value) {
    case 'longToShort': {
      longToShort()
      break
    }
    case 'shortToLong': {
      shortToLong()
      break
    }
    case 'typeMoreToLess': {
      typeMoreToLess()
      break
    }
    case 'typeLessToMore': {
      typeLessToMore()
      break
    }
    case 'lessToMore': {
      lessToMore()
      break
    }
    case 'moreToLess': {
      moreToLess()
      break
    }
    default: {
      // 可以添加一个default情况来处理未定义的sequence.value
      console.warn('Unknown sequence value:', sequence.value)
      break
    }
  }
})
function longToShort() {
  resultList.value!.sort((a, b) => b.paraLength - a.paraLength)
}
function shortToLong() {
  resultList.value!.sort((a, b) => a.paraLength - b.paraLength)
}
function typeMoreToLess() {
  resultList.value!.sort((a, b) => b.tags - a.tags)
}
function typeLessToMore() {
  resultList.value!.sort((a, b) => a.tags - b.tags)
}
function lessToMore() {
  resultList.value!.sort((a, b) => a.count - b.count)
}
function moreToLess() {
  resultList.value!.sort((a, b) => b.count - a.count)
}

// 结果显示
function getName(v): string {
  let name = v?.precursor_name
  return name
}
function getAmount(v): string {
  let amount = v?.amount
  return amount
}
function getContent(content, tag, i): string {
  const compoundNameArray = content[tag]
  if (compoundNameArray && compoundNameArray.length >= i) {
    return compoundNameArray[i]
  } else {
    return null
  }
}
function getIcon(role): string {
  if (role == 'user') {
    return 'mdi-account-circle'
  } else if (role == 'system') {
    return 'mdi mdi-monitor'
  } else {
    return 'mdi mdi-chart-donut-variant'
  }
}
function getIconColor(role): string {
  if (role == 'user') {
    return 'yellow-darken-2'
  } else if (role == 'system') {
    return 'primary'
  } else {
    return 'secondary'
  }
}

const downloadResults = () => {
  if (resultList.value?.length === 0) {
    MessagePlugin.error('没有数据可以下载！')
  }
  // 创建一个新数组，只包含每个项的 para 和 result 属性
  const dataToDownload = resultList.value.map((item) => ({
    paragraphContent: item.paragraphContent,
    results: item.results,
    markedResults: item.markedResults,
    prompt: item.prompt,
  }))

  // 将 resultList 转换为 JSON 字符串
  const jsonData = JSON.stringify(dataToDownload, null, 2)

  // 创建一个 Blob 对象
  const blob = new Blob([jsonData], { type: 'application/json' })

  // 创建一个可下载的链接
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', curTask.value?.name + '_data.json') // 设置下载文件名
  link.style.display = 'none' // 隐藏链接元素

  // 将链接添加到文档中
  document.body.appendChild(link)

  // 模拟点击链接来下载文件
  link.click()

  // 下载完成后移除链接和释放 URL 对象
  URL.revokeObjectURL(url)
  document.body.removeChild(link)
}
</script>

<style scoped>
.main-height {
  height: calc(100vh - 208px);
  overflow: scroll;
}
.ellipsis {
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 溢出内容隐藏 */
  text-overflow: ellipsis; /* 使用省略号表示溢出的内容 */
}
.text-container {
  white-space: pre-line;
  border-radius: 0;
}

.v-col {
  padding: 0.1em;
}

.bento-box {
  height: 100%;
  padding: 0.5rem;
  border-radius: 1rem;
  border: 2px solid #e0e0e0;
  width: 100%;
}

.select-position {
  position: sticky; /* 子元素使用sticky定位 */
  top: 0; /* 当滚动到距离顶部0px时固定 */
  padding-top: 10px;
  padding-left: 10px;
  z-index: 1; /* 确保子元素在滚动内容之上 */
  /* background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.65),
    rgba(255, 255, 255, 0.94),
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 1)
  ); */
  background-color: white;
}

.bento-box-bottom {
  height: 100%;
  padding: 0 0.5rem;
  border-radius: 1rem;
  border: 2px solid #e0e0e0;
}
.prompt-cards {
  overflow-y: scroll;
}
</style>
