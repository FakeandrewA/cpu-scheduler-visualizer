// src/metrics/throughput.js
/**
 * Calculates the throughput of the scheduling algorithm
 * Throughput = Number of Processes / Total Time
 * 
 * @param {Array} processes - Array of process objects
 * @param {Object} completionTimes - Object mapping process IDs to completion times
 * @returns {number} Throughput value
 */
export function calculateThroughput(processes, completionTimes) {
  // Find the maximum completion time
  const maxCompletionTime = Math.max(...Object.values(completionTimes));
  
  // Find the minimum arrival time
  const minArrivalTime = Math.min(...processes.map(p => p.arrivalTime));
  
  // Calculate total time
  const totalTime = maxCompletionTime - minArrivalTime;
  
  // Check for zero total time (edge case when all processes arrive and complete at the same time)
  if (totalTime === 0) {
    return processes.length; // All processes completed instantly
  }
  
  // Calculate throughput
  return processes.length / totalTime;
}