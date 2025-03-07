// src/frontend/main.js
import { renderGanttChart } from './components/ganttChart.js';
import { renderMetricsTable } from './components/metricsTable.js';
import { calculateRoundRobin } from '../algorithms/round-robin/roundRobin.js';
import { calculateNonPreemptivePriority, calculatePreemptivePriority } from '../algorithms/priority/priorityScheduling.js';
import { calculateNonPreemptiveSJF, calculatePreemptiveSJF } from '../algorithms/sjf/sjfScheduling.js';
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
    const priorityContainer = document.getElementById('priority-container');
    
    // Show/hide time quantum input for Round Robin
    quantumContainer.style.display = algorithmSelect.value === 'rr' ? 'block' : 'none';
    
    // Show/hide priority inputs for priority scheduling algorithms
    const isPriority = algorithmSelect.value === 'priority-np' || algorithmSelect.value === 'priority-p';
    
    // Show or hide priority column in the process table
    const priorityHeaders = document.querySelectorAll('.priority-header');
    const priorityInputs = document.querySelectorAll('.priority-input');
    
    priorityHeaders.forEach(header => {
      header.style.display = isPriority ? 'block' : 'none';
    });
    
    priorityInputs.forEach(input => {
      input.style.display = isPriority ? 'block' : 'none';
    });
    
    // Update the grid template for the process rows and header
    const tableHeader = document.querySelector('.table-header');
    const processRows = document.querySelectorAll('.process-row');
    
    if (isPriority) {
      tableHeader.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
      processRows.forEach(row => {
        row.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
      });
    } else {
      tableHeader.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
      processRows.forEach(row => {
        row.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
      });
    }
  });

  // Add a new process input row
  addProcessBtn.addEventListener('click', () => {
    const processCount = document.querySelectorAll('.process-row').length;
    const newProcess = document.createElement('div');
    newProcess.className = 'process-row';
    
    // Check if priority algorithms are selected
    const isPriority = algorithmSelect.value === 'priority-np' || algorithmSelect.value === 'priority-p';
    const gridColumns = isPriority ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr';
    
    newProcess.style.gridTemplateColumns = gridColumns;
    
    newProcess.innerHTML = `
      <input type="text" name="process-id" value="P${processCount}" readonly>
      <input type="number" name="arrival-time" min="0" value="0" required>
      <input type="number" name="burst-time" min="1" value="1" required>
      <input type="number" name="priority" min="1" value="1" required class="priority-input" style="display: ${isPriority ? 'block' : 'none'}">
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

    // Collect and validate process data
    let isValid = true;

    document.querySelectorAll('.process-row').forEach(row => {
      const arrivalTime = parseInt(row.querySelector('[name="arrival-time"]').value, 10);
      const burstTime = parseInt(row.querySelector('[name="burst-time"]').value, 10);
      let priority = null;
      
      // Get priority if relevant
      if (algorithm === 'priority-np' || algorithm === 'priority-p') {
        const priorityInput = row.querySelector('[name="priority"]');
        priority = parseInt(priorityInput.value, 10);
        
        if (isNaN(priority) || priority < 1) {
          isValid = false;
          alert(`Invalid priority for ${row.querySelector('[name="process-id"]').value}! Priority must be a positive integer.`);
          return;
        }
      }

      if (arrivalTime < 0 || burstTime <= 0 || isNaN(arrivalTime) || isNaN(burstTime)) {
        isValid = false;
        alert(`Invalid values detected! Arrival time must be >= 0 and burst time must be > 0.`);
        return;
      }

      processes.push({
        id: row.querySelector('[name="process-id"]').value,
        arrivalTime,
        burstTime,
        remainingTime: burstTime,
        priority: priority
      });
    });

    if (!isValid) return; // Stop execution if input is invalid

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
        alert('FCFS algorithm will be implemented by your teammate');
        return;
      } else if (algorithm === 'sjf-np') {
        const result = calculateNonPreemptiveSJF(processes);
        schedule = result.schedule;
        completionTimes = result.completionTimes;
      } else if (algorithm === 'sjf-p') {
        const result = calculatePreemptiveSJF(processes);
        schedule = result.schedule;
        completionTimes = result.completionTimes;
      } else if (algorithm === 'priority-np') {
        const result = calculateNonPreemptivePriority(processes);
        schedule = result.schedule;
        completionTimes = result.completionTimes;
      } else if (algorithm === 'priority-p') {
        const result = calculatePreemptivePriority(processes);
        schedule = result.schedule;
        completionTimes = result.completionTimes;
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