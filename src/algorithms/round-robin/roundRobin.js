// src/algorithms/round-robin/roundRobin.js

/**
 * Calculates the execution schedule and completion times for processes
 * using the Round Robin scheduling algorithm
 * 
 * @param {Array} processes - Array of process objects with id, arrivalTime, burstTime, and remainingTime
 * @param {number} quantum - Time quantum for Round Robin
 * @returns {Object} Object containing schedule and completionTimes
 */
export function calculateRoundRobin(processes, quantum) {
  // Validate input
  if (!Array.isArray(processes) || processes.length === 0 || quantum <= 0) {
    throw new Error("Invalid input: processes should be a non-empty array, and quantum should be a positive number.");
  }

  // Make a deep copy to avoid modifying the original array
  const processQueue = JSON.parse(JSON.stringify(processes));

  // Ensure no negative arrival or burst times
  for (const process of processQueue) {
    if (process.arrivalTime < 0 || process.burstTime <= 0) {
      throw new Error(`Invalid process data: Process ${process.id} has arrivalTime ${process.arrivalTime} or burstTime ${process.burstTime}.`);
    }
  }

  // Sort processes by arrival time
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

  const schedule = [];
  const completionTimes = {};
  let currentTime = 0;
  let readyQueue = [];
  let completed = 0;

  // Initialize with first process arrival if no processes arrive at time 0
  if (processQueue.length > 0 && processQueue[0].arrivalTime > 0) {
    currentTime = processQueue[0].arrivalTime;
  }

  // Create a map to track remaining times
  const remainingTimeMap = {};
  processQueue.forEach(process => {
    remainingTimeMap[process.id] = process.burstTime;
  });

  // Run until all processes are completed
  while (completed < processes.length) {
    // Add newly arrived processes to the ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift());
    }

    // If no process is ready, move time to the next process arrival
    if (readyQueue.length === 0 && processQueue.length > 0) {
      currentTime = processQueue[0].arrivalTime;
      continue;
    }

    // If no processes left, exit
    if (readyQueue.length === 0 && processQueue.length === 0) {
      break;
    }

    // Get the next process
    const currentProcess = readyQueue.shift();
    const startTime = currentTime;

    // Execute for quantum time or until completion
    const executeTime = Math.min(quantum, remainingTimeMap[currentProcess.id]);
    currentTime += executeTime;
    remainingTimeMap[currentProcess.id] -= executeTime;

    // Add to schedule
    schedule.push({
      processId: currentProcess.id,
      startTime,
      endTime: currentTime
    });

    // Check if process is completed
    if (remainingTimeMap[currentProcess.id] > 0) {
      // Add newly arrived processes to the ready queue before reinserting the current process
      while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
        readyQueue.push(processQueue.shift());
      }

      // Reinsert unfinished process
      readyQueue.push(currentProcess);
    } else {
      // Process completed
      completionTimes[currentProcess.id] = currentTime;
      completed++;
    }
  }

  return {
    schedule,
    completionTimes
  };
}
