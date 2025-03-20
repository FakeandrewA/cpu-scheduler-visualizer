import random
import csv
import heapq
import pandas as pd

# FCFS Algorithm
def fcfs(processes):
    processes.sort(key=lambda x: x['arrival_time'])
    current_time = 0
    waiting_times = []
    turnaround_times = []

    for p in processes:
        arrival = p['arrival_time']
        burst = p['burst_time']
        if current_time < arrival:
            current_time = arrival
        waiting_time = current_time - arrival
        turnaround_time = waiting_time + burst

        waiting_times.append(waiting_time)
        turnaround_times.append(turnaround_time)

        current_time += burst

    avg_waiting_time = sum(waiting_times) / len(processes)
    avg_turnaround_time = sum(turnaround_times) / len(processes)

    return avg_waiting_time, avg_turnaround_time

# SJF (Non-preemptive)
def sjf(processes):
    processes.sort(key=lambda x: x['arrival_time'])
    completed = 0
    current_time = 0
    waiting_times = []
    turnaround_times = []
    process_queue = []
    i = 0
    n = len(processes)

    while completed < n:
        while i < n and processes[i]['arrival_time'] <= current_time:
            process_queue.append(processes[i])
            i += 1

        if process_queue:
            process_queue.sort(key=lambda x: x['burst_time'])
            p = process_queue.pop(0)
            arrival = p['arrival_time']
            burst = p['burst_time']

            waiting_time = current_time - arrival
            if waiting_time < 0:
                current_time = arrival
                waiting_time = 0
            turnaround_time = waiting_time + burst

            waiting_times.append(waiting_time)
            turnaround_times.append(turnaround_time)

            current_time += burst
            completed += 1
        else:
            current_time += 1

    avg_waiting_time = sum(waiting_times) / n
    avg_turnaround_time = sum(turnaround_times) / n

    return avg_waiting_time, avg_turnaround_time

# SRTF (Preemptive SJF)
def srtf(processes):
    n = len(processes)
    remaining_time = [p['burst_time'] for p in processes]
    complete = 0
    current_time = 0
    minm = float('inf')
    shortest = 0
    finish_time = 0
    check = False
    waiting_times = [0] * n
    turnaround_times = [0] * n

    while complete != n:
        for j in range(n):
            if (processes[j]['arrival_time'] <= current_time and
                remaining_time[j] < minm and remaining_time[j] > 0):
                minm = remaining_time[j]
                shortest = j
                check = True

        if not check:
            current_time += 1
            continue

        remaining_time[shortest] -= 1
        minm = remaining_time[shortest]
        if minm == 0:
            minm = float('inf')

        if remaining_time[shortest] == 0:
            complete += 1
            finish_time = current_time + 1
            turnaround_times[shortest] = finish_time - processes[shortest]['arrival_time']
            waiting_times[shortest] = (turnaround_times[shortest] - processes[shortest]['burst_time'])

            if waiting_times[shortest] < 0:
                waiting_times[shortest] = 0

        current_time += 1

    avg_waiting_time = sum(waiting_times) / n
    avg_turnaround_time = sum(turnaround_times) / n

    return avg_waiting_time, avg_turnaround_time

# Priority Scheduling (Non-preemptive)
def priority_scheduling(processes):
    processes.sort(key=lambda x: (x['arrival_time'], x['priority']))
    current_time = 0
    completed = 0
    waiting_times = []
    turnaround_times = []
    process_queue = []
    i = 0
    n = len(processes)

    while completed < n:
        while i < n and processes[i]['arrival_time'] <= current_time:
            process_queue.append(processes[i])
            i += 1

        if process_queue:
            process_queue.sort(key=lambda x: x['priority'])
            p = process_queue.pop(0)
            arrival = p['arrival_time']
            burst = p['burst_time']

            waiting_time = current_time - arrival
            if waiting_time < 0:
                current_time = arrival
                waiting_time = 0
            turnaround_time = waiting_time + burst

            waiting_times.append(waiting_time)
            turnaround_times.append(turnaround_time)

            current_time += burst
            completed += 1
        else:
            current_time += 1

    avg_waiting_time = sum(waiting_times) / n
    avg_turnaround_time = sum(turnaround_times) / n

    return avg_waiting_time, avg_turnaround_time

# Preemptive Priority Scheduling (Optimized)
def preemptive_priority_scheduling(processes):
    n = len(processes)
    if n == 0:
        return 0, 0
    current_time = 0
    completed = 0
    total_waiting_time = 0
    total_turnaround_time = 0

    remaining_bt = {p['pid']: p['burst_time'] for p in processes}

    pq = []
    process_dict = {p['pid']: p for p in processes}

    processes_sorted = sorted(processes, key=lambda x: x['arrival_time'])
    i = 0

    start_times = {}
    finish_times = {}

    while completed < n:
        while i < n and processes_sorted[i]['arrival_time'] <= current_time:
            proc = processes_sorted[i]
            heapq.heappush(pq, (proc['priority'], proc['arrival_time'], proc['pid']))
            i += 1

        if pq:
            priority, at, pid = heapq.heappop(pq)

            if pid not in start_times:
                start_times[pid] = current_time

            remaining_bt[pid] -= 1
            current_time += 1

            if remaining_bt[pid] == 0:
                completed += 1
                finish_times[pid] = current_time
                turnaround_time = finish_times[pid] - process_dict[pid]['arrival_time']
                waiting_time = turnaround_time - process_dict[pid]['burst_time']
                total_turnaround_time += turnaround_time
                total_waiting_time += waiting_time
            else:
                heapq.heappush(pq, (priority, at, pid))
        else:
            current_time += 1

    avg_waiting_time = total_waiting_time / n
    avg_turnaround_time = total_turnaround_time / n

    return avg_waiting_time, avg_turnaround_time

def generate_data_and_evaluate(num_samples):
    data = []

    for sample in range(num_samples):
        num_processes = random.randint(1, 50)
        processes = []

        zero_priority_count = 0

        for pid in range(num_processes):
            burst_time = random.randint(5, 20)
            arrival_time = random.randint(0, 10)
            priority = random.choice([0, random.randint(1, 5)])
            if priority == 0:
                zero_priority_count += 1
            processes.append({
                'pid': pid,
                'arrival_time': arrival_time,
                'burst_time': burst_time,
                'priority': priority
            })

        # If too many zero priorities, set all to zero
        if zero_priority_count > (num_processes // 2):
            for p in processes:
                p['priority'] = 0

        avg_arrival = sum([p['arrival_time'] for p in processes]) / num_processes
        avg_burst = sum([p['burst_time'] for p in processes]) / num_processes
        avg_priority = sum([p['priority'] for p in processes]) / num_processes
        std_burst = pd.Series([p['burst_time'] for p in processes]).std()

        # Run each algorithm and collect their metrics
        fcfs_wt, fcfs_tat = fcfs(processes.copy())
        sjf_wt, sjf_tat = sjf(processes.copy())
        srtf_wt, srtf_tat = srtf(processes.copy())
        priority_wt, priority_tat = priority_scheduling(processes.copy()) if avg_priority != 0 else (float('inf'), float('inf'))
        preemptive_priority_wt, preemptive_priority_tat = preemptive_priority_scheduling(processes.copy()) if avg_priority != 0 else (float('inf'), float('inf'))

        # Create a dictionary for easier access
        algorithms = {
            'FCFS': (fcfs_wt, fcfs_tat),
            'SJF': (sjf_wt, sjf_tat),
            'SRTF': (srtf_wt, srtf_tat),
            'Priority': (priority_wt, priority_tat),
            'PreemptivePriority': (preemptive_priority_wt, preemptive_priority_tat)
        }

        # Select the best algorithm based on avg waiting time
        best_algo = min(algorithms, key=lambda k: algorithms[k][0])

        best_wt, best_tat = algorithms[best_algo]

        # Throughput = number of processes / total time
        # Approximate total time: max arrival time + sum of all bursts
        total_time = max([p['arrival_time'] for p in processes]) + sum([p['burst_time'] for p in processes])

        throughput = num_processes / total_time if total_time > 0 else 0

        # Append all the features + new metrics
        data.append([
            avg_arrival,
            avg_burst,
            avg_priority,
            std_burst,
            num_processes,
            best_algo,
            best_wt,
            best_tat,
            throughput
        ])

    # Save to CSV
    df = pd.DataFrame(data, columns=[
        'avg_arrival',
        'avg_burst',
        'avg_priority',
        'std_burst',
        'num_processes',
        'best_algo',
        'best_avg_waiting_time',
        'best_avg_turnaround_time',
        'throughput'
    ])
    df.to_csv('cpu_scheduler_dataset.csv', index=False)

    print("Dataset generation complete. Saved to cpu_scheduler_dataset.csv")

# Run for 100 samples
generate_data_and_evaluate(1000)
