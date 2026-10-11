import re
import math
# 调用函数处理文件
filename = 'README.md'  
def parse_tasks(task_str):
    # 清理并分割任务
    task_str = task_str.replace('),', ');').replace(')', ');').strip(';')
    task_tuples = task_str.split(';')
    
    # 计算总工作量
    total_workload = 0
    # 权重数组，每个任务类型对应一个权重
    w = [0.10174415/200, 0.21308889, 0.20320471/30, 0.28550967, 0.19645258]
    for task in task_tuples:
        if task:
            task_type, quantity, time, importance = map(int, task.strip('()').split(','))
            total_workload += w[int(task_type)-1] * quantity * math.sqrt(time * importance)
    return total_workload
def update_markdown_file(origin_row, new_workload):
    with open(filename, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # 准备要写入的内容
    updated_lines = []
    found = False  # 标记是否找到行

    for line in lines:
        if line.strip() == origin_row.strip():
            # 分割行，更新最后一列
            columns = line.split('|')
            if len(columns) > 3:
                columns[-2] = f' {new_workload:.6f} '  # 格式化新工作量，更新倒数第二列（通常是贡献度列）
                updated_line = '|'.join(columns)
                updated_lines.append(updated_line)
                found = True
            else:
                updated_lines.append(line)
        else:
            updated_lines.append(line)

    # 如果找到并更新了行，则重新写入文件
    if found:
        with open(filename, 'w', encoding='utf-8') as file:
            file.writelines(updated_lines)
    else:
        print("No matching row found.")

def process_markdown_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 正则表达式找到每个周的段落
    weeks = re.split(r'\n#### 第[\w+]+周', content)
    week_titles = re.findall(r'\n#### (第[\w+]+周)', content)
    
    overall_results = {}
    week_results_list = []
    
    for week, title in zip(weeks[1:], week_titles):  # 跳过第一个拆分结果，因为它通常是空的
        lines = week.strip().split('\n')
        if len(lines) < 2:
            continue  # 如果没有数据就跳过
        
        table_rows = lines[2:]  # 跳过表头行
        week_results = {}
        
        for row in table_rows:
            columns = row.split('|')
            if len(columns) < 4:
                continue  # 忽略格式不正确的行
            name = columns[1].strip()
            tasks = columns[3].strip()
            
            total_workload = parse_tasks(tasks)
            week_results[name] = total_workload
            origin_row = row
            # print(origin_row)
            update_markdown_file(origin_row,total_workload)

            # print(total_workload)
            # 累积到整体结果中
            if name in overall_results:
                overall_results[name] += total_workload
            else:
                overall_results[name] = total_workload
        
        week_results_list.append({ 'week': title, 'data': week_results })
    
    return week_results_list, overall_results


week_data, total_results = process_markdown_file(filename)

# 打印每周的计算结果
for week_result in week_data:
    print(week_result['week'])
    for name, workload in week_result['data'].items():
        print(f"{name}: {workload}")
    print()  

# 打印每个人的总工作量
print("总工作量:")
for name, total_workload in total_results.items():
    print(f"{name}: {total_workload}")
