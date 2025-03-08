
// src/algorithms/fcfs/fcfsScheduling.js

/**
 * Calculates the execution schedule and completion times for processes
 * using the First-Come-First-Serve (FCFS) scheduling algorithm
 * 
 * @param {Array} processes - Array of process objects with id, arrivalTime, and burstTime
 * @returns {Object} Object containing schedule and completionTimes
 */
export function calculateFCFS(processes) {
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
  
    // Sort processes by arrival time
    processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    const schedule = [];
    const completionTimes = {};
    let currentTime = 0;
    let completed = 0;
  
    // Set current time to the first process arrival if no processes arrive at time 0
    if (processQueue.length > 0 && processQueue[0].arrivalTime > 0) {
      currentTime = processQueue[0].arrivalTime;
    }
  
    // Process each job in arrival order
    while (processQueue.length > 0) {
      // Get the next process (already sorted by arrival time)
      const currentProcess = processQueue.shift();
      
      // If there's idle time before this process arrives, update currentTime
      if (currentProcess.arrivalTime > currentTime) {
        currentTime = currentProcess.arrivalTime;
      }
      
      const startTime = currentTime;
      
      // Execute the process
      currentTime += currentProcess.burstTime;
      
      // Add to schedule
      schedule.push({
        processId: currentProcess.id,
        startTime,
        endTime: currentTime
      });
      
      // Record completion time
      completionTimes[currentProcess.id] = currentTime;
      completed++;
    }
  
    return {
      schedule,
      completionTimes
    };
  }