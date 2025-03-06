// src/frontend/main.js
import { renderGanttChart } from './components/ganttChart.js';
import { renderMetricsTable } from './components/metricsTable.js';
import { calculateRoundRobin } from '../algorithms/round-robin/roundRobin.js';
import { calculateWaitingTime, calculateTurnaroundTime, calculateThroughput } from '../metrics/index.js';

document.addEventListener('DOMContentLoaded', () => {
  const processForm = document.getElementById('process-form');
  const addProcessBtn = document.getElementById('add-process');
  const calculateBtn = document.getElementById('calculate');
  const algorithmSelect = document.getElementById('algorithm');
  const quantumInput = document.getElementById('time-quantum');
  const processesContainer = document.getElementById('processes');
  const resultsContainer = document.getElementById('results');

  // Show/hide time quantum based on algorithm selection
  algorithmSelect.addEventListener('change', () => {
    const quantumContainer = document.getElementById('quantum-container');
    quantumContainer.style.display = algorithmSelect.value === 'rr' ? 'block' : 'none';
  });

  // Add a new process input row
  addProcessBtn.addEventListener('click', () => {
    const processCount = document.querySelectorAll('.process-row').length;
    const newProcess = document.createElement('div');
    newProcess.className = 'process-row';
    newProcess.innerHTML = `
      <input type="text" name="process-id" value="P${processCount}" readonly>
      <input type="number" name="arrival-time" min="0" value="0" required>
      <input type="number" name="burst-time" min="1" value="1" required>
      <button type="button" class="remove-process">Remove</button>
    `;
    processesContainer.appendChild(newProcess);

    // Add event listener to remove button
    newProcess.querySelector('.remove-process').addEventListener('click', () => {
      newProcess.remove();
      // Renumber the process IDs
      document.querySelectorAll('.process-row').forEach((row, index) => {
        row.querySelector('[name="process-id"]').value = `P${index}`;
      });
    });
  });

  // Calculate and display results
  calculateBtn.addEventListener('click', () => {
    const algorithm = algorithmSelect.value;
    const processes = [];

    // Collect process data
    document.querySelectorAll('.process-row').forEach(row => {
      processes.push({
        id: row.querySelector('[name="process-id"]').value,
        arrivalTime: parseInt(row.querySelector('[name="arrival-time"]').value, 10),
        burstTime: parseInt(row.querySelector('[name="burst-time"]').value, 10),
        remainingTime: parseInt(row.querySelector('[name="burst-time"]').value, 10)
      });
    });

    if (processes.length === 0) {
      alert('Please add at least one process');
      return;
    }

    let schedule, completionTimes;

    try {
      // Call appropriate algorithm
      if (algorithm === 'rr') {
        const quantum = parseInt(quantumInput.value, 10);
        if (isNaN(quantum) || quantum < 1) {
          alert('Please enter a valid time quantum');
          return;
        }
        const result = calculateRoundRobin(processes, quantum);
        schedule = result.schedule;
        completionTimes = result.completionTimes;
      } else if (algorithm === 'fcfs') {
        // FCFS will be implemented by Friend 1
        alert('FCFS algorithm will be implemented by your teammate');
        return;
      } else if (algorithm === 'sjf') {
        // SJF will be implemented by Friend 2
        alert('SJF algorithm will be implemented by your teammate');
        return;
      }

      // Calculate metrics
      const waitingTimes = calculateWaitingTime(processes, completionTimes);
      const turnaroundTimes = calculateTurnaroundTime(processes, completionTimes);
      const throughput = calculateThroughput(processes, completionTimes);

      // Render results
      resultsContainer.innerHTML = '';
      renderGanttChart(resultsContainer, schedule);
      renderMetricsTable(resultsContainer, processes, waitingTimes, turnaroundTimes, throughput);
    } catch (error) {
      console.error('Error in calculation:', error);
      alert('There was an error calculating the results. Check the console for details.');
    }
  });

  // Add initial process (make sure at least one process exists)
  addProcessBtn.click();
});