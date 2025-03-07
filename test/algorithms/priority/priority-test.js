import { calculateNonPreemptivePriority, calculatePreemptivePriority } from '../../../src/algorithms/priority/priorityScheduling.js';

// Test data
const testProcesses = [
  { id: 'P0', arrivalTime: 0, burstTime: 5, priority: 3 },
  { id: 'P1', arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: 'P2', arrivalTime: 2, burstTime: 8, priority: 2 },
  { id: 'P3', arrivalTime: 3, burstTime: 6, priority: 4 }
];

console.log('Testing Non-Preemptive Priority Scheduling:');
const nonPreemptiveResult = calculateNonPreemptivePriority(testProcesses);
console.log('Schedule:', nonPreemptiveResult.schedule);
console.log('Completion Times:', nonPreemptiveResult.completionTimes);

console.log('\nTesting Preemptive Priority Scheduling:');
const preemptiveResult = calculatePreemptivePriority(testProcesses);
console.log('Schedule:', preemptiveResult.schedule);
console.log('Completion Times:', preemptiveResult.completionTimes);