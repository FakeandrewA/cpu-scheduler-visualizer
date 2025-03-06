// src/metrics/waiting-time.js
/**
 * Calculates the waiting time for each process
 * Waiting Time = Turnaround Time - Burst Time
 * 
 * @param {Array} processes - Array of process objects
 * @param {Object} completionTimes - Object mapping process IDs to completion times
 * @returns {Object} Object mapping process IDs to waiting times
 */
export function calculateWaitingTime(processes, completionTimes) {
  const waitingTimes = {};
  
  processes.forEach(process => {
    const turnaroundTime = completionTimes[process.id] - process.arrivalTime;
    waitingTimes[process.id] = turnaroundTime - process.burstTime;
  });
  
  return waitingTimes;
}

Find the minimum arrival time
  const minArrivalTime = Math.min(...processes.map(p => p.arrivalTime));
  
  // Calculate total time
  const totalTime = maxCompletionTime - minArrivalTime;
  
  // Calculate throughput
  return processes.length / totalTime;
}
