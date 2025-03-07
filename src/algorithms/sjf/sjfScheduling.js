// src/algorithms/sjf/sjfScheduling.js

/**
 * Calculates the execution schedule and completion times for processes
 * using the Non-Preemptive Shortest Job First scheduling algorithm
 * 
 * @param {Array} processes - Array of process objects with id, arrivalTime, and burstTime
 * @returns {Object} Object containing schedule and completionTimes
 */
export function calculateNonPreemptiveSJF(processes) {
    // Validate input
    if (!Array.isArray(processes) || processes.length === 0) {
      throw new Error("Invalid input: processes should be a non-empty array.");
    }
  
    // Make a deep copy to avoid modifying the original array
    const processQueue = JSON.parse(JSON.stringify(processes));
  
    // Ensure all processes have valid times
    for (const process of processQueue) {
      if (process.arrivalTime < 0 || process.burstTime <= 0) {
        throw new Error(`Invalid process data: Process ${process.id} has invalid arrivalTime or burstTime.`);
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
  
      // Sort readyQueue by burst time (shortest job first)
      readyQueue.sort((a, b) => a.burstTime - b.burstTime);
  
      // Get the shortest job
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
 * using the Preemptive Shortest Job First (Shortest Remaining Time First) scheduling algorithm
 * 
 * @param {Array} processes - Array of process objects with id, arrivalTime, and burstTime
 * @returns {Object} Object containing schedule and completionTimes
 */
export function calculatePreemptiveSJF(processes) {
  // Validate input
  if (!Array.isArray(processes) || processes.length === 0) {
    throw new Error("Invalid input: processes should be a non-empty array.");
  }

  // Make a deep copy to avoid modifying the original array
  const processQueue = JSON.parse(JSON.stringify(processes));

  // Ensure all processes have valid times
  for (const process of processQueue) {
    if (process.arrivalTime < 0 || process.burstTime <= 0) {
      throw new Error(`Invalid process data: Process ${process.id} has invalid arrivalTime or burstTime.`);
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
  
  // Array to track processes that are ready to execute
  let readyQueue = [];
  
  // Track the last executed process to avoid creating too many fragments in the schedule
  let lastExecutedProcess = null;
  
  // Initialize current time to first process arrival if no processes arrive at time 0
  if (processQueue.length > 0 && processQueue[0].arrivalTime > 0) {
    currentTime = processQueue[0].arrivalTime;
  }

  // Run until all processes are completed
  while (completed < processes.length) {
    // Move arrived processes to the ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift());
    }
    
    // If no processes in ready queue, advance time to next arrival
    if (readyQueue.length === 0) {
      if (processQueue.length === 0) {
        break; // No more processes to execute
      }
      currentTime = processQueue[0].arrivalTime;
      continue;
    }
    
    // Sort ready queue by remaining time (shortest remaining time first)
    // If tie, sort by process ID to ensure deterministic behavior
    readyQueue.sort((a, b) => {
      if (a.remainingTime === b.remainingTime) {
        return a.id - b.id;  // Break ties using process IDs
      }
      return a.remainingTime - b.remainingTime;
    });
    
    // Get the process with shortest remaining time
    const currentProcess = readyQueue[0];
    
    // Calculate how long this process will run
    let nextEventTime = currentTime + currentProcess.remainingTime; // Run to completion by default
    
    // Check if a new process arrives before completion
    if (processQueue.length > 0) {
      nextEventTime = Math.min(nextEventTime, processQueue[0].arrivalTime);
    }
    
    // Calculate execution time in this time slice
    const executionTime = nextEventTime - currentTime;
    
    // Add to schedule if time actually passes
    if (executionTime > 0) {
      // Check if we can merge with the previous schedule entry
      const lastScheduleEntry = schedule.length > 0 ? schedule[schedule.length - 1] : null;
      
      if (lastScheduleEntry && lastScheduleEntry.processId === currentProcess.id && 
          lastScheduleEntry.endTime === currentTime) {
        // Extend the previous entry instead of creating a new one
        lastScheduleEntry.endTime = nextEventTime;
      } else {
        // Create a new schedule entry
        schedule.push({
          processId: currentProcess.id,
          startTime: currentTime,
          endTime: nextEventTime
        });
      }
      
      // Update process remaining time
      currentProcess.remainingTime -= executionTime;
      
      // Check if process is completed
      if (currentProcess.remainingTime <= 0) {
        completionTimes[currentProcess.id] = nextEventTime;
        // Remove from ready queue
        readyQueue.shift();
        completed++;
      }
      
      // Update current time
      currentTime = nextEventTime;
      
      // Update last executed process
      lastExecutedProcess = currentProcess;
    } else {
      // This is a safeguard against infinite loops
      if (processQueue.length === 0 && readyQueue.every(p => p.remainingTime <= 0)) {
        break;
      }
      
      // If no time passes, remove this process and try another
      // This should not happen with correct logic, but is a failsafe
      readyQueue.shift();
      if (currentProcess.remainingTime > 0) {
        readyQueue.push(currentProcess);
      }
      
      // Move time forward by a small amount if stuck
      currentTime += 0.001;
    }
  }

  return {
    schedule,
    completionTimes
  };
}