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
  // Make a deep copy of processes to avoid modifying the original
  const processQueue = JSON.parse(JSON.stringify(processes));
  
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
  
  // Create a map to keep track of remaining times
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
    
    // If ready queue is empty but processes remain, move time to next process arrival
    if (readyQueue.length === 0 && processQueue.length > 0) {
      currentTime = processQueue[0].arrivalTime;
      continue;
    }
    
    // If both queues are empty, we're done
    if (readyQueue.length === 0 && processQueue.length === 0) {
      break;
    }
    
    // Get the next process from ready queue
    const currentProcess = readyQueue.shift();
    const startTime = currentTime;
    
    // Execute for quantum time or until process completes
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
      // Add newly arrived processes to the ready queue before putting back the current process
      while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
        readyQueue.push(processQueue.shift());
      }
      
      // Put back in ready queue
      readyQueue.push(currentProcess);
    } else {
      // Process is completed, record completion time
      completionTimes[currentProcess.id] = currentTime;
      completed++;
    }
  }
  
  return {
    schedule,
    completionTimes
  };
}