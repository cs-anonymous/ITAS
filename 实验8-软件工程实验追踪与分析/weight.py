import numpy as np
def read_matrix(file_path,i):
    with open(file_path, 'r') as file:
        lines = file.readlines()  # 读取所有行
        if i < len(lines):  # 检查是否超出行数
            data = lines[i].strip().split()
            data = [float(eval(x)) if '/' in x else float(x) for x in data]  # 支持分数形式的输入
        else:
            raise IndexError("Requested line number exceeds the total number of lines in the file.")
    # 初始化一个 5x5 的矩阵
    n = 5
    matrix = np.ones((n, n))  # 开始时，对角线元素都设为 1
        
    # 用读取的数据填充上三角，不包括对角线
    index = 0
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j] = data[index]
            matrix[j][i] = 1 / matrix[i][j]  # 下三角为上三角的倒数
            index += 1
    
    return matrix
def calculate_weights(matrix):
    # 计算特征值和特征向量
    eigenvalues, eigenvectors = np.linalg.eig(matrix)
    # 提取最大特征值对应的特征向量
    max_eigenvalue_index = np.argmax(eigenvalues)
    max_eigenvector = np.abs(eigenvectors[:, max_eigenvalue_index])
    # 归一化特征向量作为权重
    weights = max_eigenvector / max_eigenvector.sum()
    return weights

def consistency_check(matrix, weights):
    # 计算一致性指标 CI
    n = matrix.shape[0]
    lambda_max = (np.dot(matrix, weights) / weights).mean()
    CI = (lambda_max - n) / (n - 1)
    
    # 查找对应的RI值（随机一致性指数），这里是 5x5 矩阵的 RI 值
    RI = 1.12
    
    # 计算一致性比率 CR
    CR = CI / RI
    return CR


file_path = 'data.txt'
team = 8
consistent_num = 0
sum_w = np.zeros(5)
for i in range(team):
    A = read_matrix(file_path,i)
    print(f"********no.{i+1}***********")
    # print(A)
    weights = calculate_weights(A)
    CR = consistency_check(A, weights)
    
    
    # print("Consistency Ratio (CR):", CR)
    if CR < 0.1:
        print("Weights:", weights)
        sum_w += weights
        consistent_num+=1
        print("The matrix is consistent.")
    else:
        print("The matrix is not consistent, please revise the judgments.")
sum_w /= consistent_num
print(consistent_num,sum_w)