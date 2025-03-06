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
  
  // Run until all processes are completed
  while (processQueue.length > 0 || readyQueue.length > 0) {
    // Add newly arrived processes to the ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift());
    }
    
    // If ready queue is empty, move time to next process arrival
    if (readyQueue.length === 0) {
      currentTime = processQueue[0].arrivalTime;
      continue;
    }
    
    // Get the next process from ready queue
    const currentProcess = readyQueue.shift();
    const startTime = currentTime;
    
    // Execute for quantum time or until process completes
    const executeTime = Math.min(quantum, currentProcess.remainingTime);
    currentTime += executeTime;
    currentProcess.remainingTime -= executeTime;
    
    // Add to schedule
    schedule.push({
      processId: currentProcess.id,
      startTime,
      endTime: currentTime
    });
    
    // Check if process is completed
    if (currentProcess.remainingTime > 0) {
      // Add newly arrived processes to the ready queue before putting back the current process
      while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
        readyQueue.push(processQueue.shift());
      }
      
      // Put back in ready queue
      readyQueue.push(currentProcess);
    } else {
      // Process is completed, record completion time
      completionTimes[currentProcess.id] = currentTime;
    }
  }
  
  return {
    schedule,
    completionTimes
  };
}
