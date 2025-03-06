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
  
  // Calculate throughput
  return processes.length / totalTime;
}
