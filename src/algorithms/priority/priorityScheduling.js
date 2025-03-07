// src/algorithms/priority/priorityScheduling.js

/**
 * Calculates the execution schedule and completion times for processes
 * using the Non-Preemptive Priority scheduling algorithm
 * 
 * @param {Array} processes - Array of process objects with id, arrivalTime, burstTime, and priority
 * @returns {Object} Object containing schedule and completionTimes
 */
export function calculateNonPreemptivePriority(processes) {
    // Validate input
    if (!Array.isArray(processes) || processes.length === 0) {
      throw new Error("Invalid input: processes should be a non-empty array.");
    }
  
    // Make a deep copy to avoid modifying the original array
    const processQueue = JSON.parse(JSON.stringify(processes));
  
    // Ensure all processes have priority value
    for (const process of processQueue) {
      if (process.arrivalTime < 0 || process.burstTime <= 0 || typeof process.priority !== 'number') {
        throw new Error(`Invalid process data: Process ${process.id} has invalid arrivalTime, burstTime, or priority.`);
      }
    }
  
    // Sort processes by arrival time initially
    processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    const schedule = [];
    const completionTimes = {};
    let currentTime = 0;
    let completed = 0;
    let readyQueue = [];
  
    // Set current time to the first process arrival if no processes arrive at time 0
    if (processQueue.length > 0 && processQueue[0].arrivalTime > 0) {
      currentTime = processQueue[0].arrivalTime;
    }
  
    // Run until all processes are completed
    while (completed < processes.length) {
      // Move processes that have arrived to the readyQueue
      while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
        readyQueue.push(processQueue.shift());
      }
  
      // If no processes in readyQueue, move time to next arrival
      if (readyQueue.length === 0) {
        if (processQueue.length === 0) break; // No more processes
        currentTime = processQueue[0].arrivalTime;
        continue;
      }
  
      // Sort readyQueue by priority (lower number = higher priority)
      readyQueue.sort((a, b) => a.priority - b.priority);
  
      // Get the highest priority process
      const currentProcess = readyQueue.shift();
      const startTime = currentTime;
  
      // Execute the process
      currentTime += currentProcess.burstTime;
      
      // Add to schedule
      schedule.push({
        processId: currentProcess.id,
        startTime,
        endTime: currentTime
      });
  
      // Process completed
      completionTimes[currentProcess.id] = currentTime;
      completed++;
    }
  
    return {
      schedule,
      completionTimes
    };
  }
  
  /**
 * Calculates the execution schedule and completion times for processes
 * using the Preemptive Priority scheduling algorithm
 * 
 * @param {Array} processes - Array of process objects with id, arrivalTime, burstTime, and priority
 * @returns {Object} Object containing schedule and completionTimes
 */
export function calculatePreemptivePriority(processes) {
  // Validate input
  if (!Array.isArray(processes) || processes.length === 0) {
    throw new Error("Invalid input: processes should be a non-empty array.");
  }

  // Make a deep copy to avoid modifying the original array
  const processQueue = JSON.parse(JSON.stringify(processes));

  // Ensure all processes have priority value and valid times
  for (const process of processQueue) {
    if (process.arrivalTime < 0 || process.burstTime <= 0 || typeof process.priority !== 'number') {
      throw new Error(`Invalid process data: Process ${process.id} has invalid arrivalTime, burstTime, or priority.`);
    }
    // Add remainingTime property for tracking progress
    process.remainingTime = process.burstTime;
  }

  // Sort processes by arrival time
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

  const schedule = [];
  const completionTimes = {};
  let currentTime = 0;
  let completed = 0;
  let currentProcess = null;
  
  // Ready queue for processes that have arrived but are waiting
  let readyQueue = [];

  // Initialize to the first process arrival if no processes arrive at time 0
  if (processQueue.length > 0 && processQueue[0].arrivalTime > 0) {
    currentTime = processQueue[0].arrivalTime;
  }

  // Run until all processes are completed
  while (completed < processes.length) {
    // Move newly arrived processes from process queue to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift());
    }
    
    // If we have a current process running, add it back to the ready queue for reevaluation
    if (currentProcess) {
      readyQueue.push(currentProcess);
      currentProcess = null;
    }
    
    // If ready queue is empty (no process available), advance time to next arrival
    if (readyQueue.length === 0) {
      if (processQueue.length === 0) {
        break; // No more processes to execute
      }
      currentTime = processQueue[0].arrivalTime;
      continue;
    }
    
    // Sort ready queue by priority (lower number = higher priority)
    readyQueue.sort((a, b) => a.priority - b.priority);
    
    // Get highest priority process
    currentProcess = readyQueue.shift();
    
    // Calculate how long this process will run
    let runUntil = currentTime + currentProcess.remainingTime; // Default: run to completion
    
    // Check if a new process will arrive or a higher priority process exists
    if (processQueue.length > 0) {
      // A new process will arrive that might preempt the current one
      runUntil = Math.min(runUntil, processQueue[0].arrivalTime);
    }
    
    // Calculate actual execution time
    const executionTime = runUntil - currentTime;
    
    // Add to schedule
    schedule.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: runUntil
    });
    
    // Update process remaining time
    currentProcess.remainingTime -= executionTime;
    
    // Update current time
    currentTime = runUntil;
    
    // Check if process is completed
    if (currentProcess.remainingTime <= 0) {
      completionTimes[currentProcess.id] = currentTime;
      currentProcess = null;
      completed++;
    }
    // If process is not completed, it will be added back to the ready queue in the next iteration
  }

  return {
    schedule,
    completionTimes
  };
}
