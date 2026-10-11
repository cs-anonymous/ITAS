// 数据来源：标注数据、预测（提取）数据
export const enum DataSource {
    LABELED = 'labeled',
    EXTRACTED = 'extracted',
  }
  
  // 参数数值类型：类别、顺序、量化
  export const enum ValueType {
    CATEGORICAL = 'categorical',
    ORDINAL = 'ordinal',
    QUANTITATIVE = 'quantitative',
  }
  
  // 降维方法：PCA、t-SNE、UMAP
  export const enum DRMethod {
    PCA = 'PCA',
    TSNE = 't-SNE',
    UMAP = 'UMAP',
  }
  