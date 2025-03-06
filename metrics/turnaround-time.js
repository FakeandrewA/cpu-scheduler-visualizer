// src/metrics/turnaround-time.js
/**
 * Calculates the turnaround time for each process
 * Turnaround Time = Completion Time - Arrival Time
 * 
 * @param {Array} processes - Array of process objects
 * @param {Object} completionTimes - Object mapping process IDs to completion times
 * @returns {Object} Object mapping process IDs to turnaround times
 */
export function calculateTurnaroundTime(processes, completionTimes) {
  const turnaroundTimes = {};
  
  processes.forEach(process => {
    turnaroundTimes[process.id] = completionTimes[process.id] - process.arrivalTime;
  });
  
  return turnaroundTimes;
}
