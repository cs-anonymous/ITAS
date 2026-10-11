import { MetricCnt, Metrics, PDFResult } from './calculation'
import { DataSource } from './enum'
import { Param } from '@/types/visualization/data'

export interface TooltipData {
  title: string | number
  data: Record<string, string | number | Set<string>>
}

export interface Embedding {
  x: number
  y: number
}

export interface Paper {
  paper_name: string
  MOFs: Set<string> | string
  embedding: Embedding
}

export interface Mof {
  mof_id: string
  embedding: Embedding
  layer?: number
}

export interface ParagraphDRData {
  mof: string
  shared: boolean
  type: DataSource
  params: Record<string, Param>
  embedding: Embedding
}

export interface MetricsData {
  total: {
    cnt: MetricCnt
    metrics: Metrics
    pdf: PDFResult
  }
  params: {
    [param: string]: {
      cnt: MetricCnt
      metrics: Metrics
      pdf: PDFResult
    }
  }
}
