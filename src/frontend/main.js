// src/frontend/main.js
import { renderGanttChart } from './components/ganttChart.js';
import { renderMetricsTable } from './components/metricsTable.js';
import { calculateRoundRobin } from '../algorithms/round-robin/roundRobin.js';
import { calculateNonPreemptivePriority, calculatePreemptivePriority } from '../algorithms/priority/priorityScheduling.js';
import { calculateNonPreemptiveSJF, calculatePreemptiveSJF } from '../algorithms/sjf/sjfScheduling.js';
import { calculateFCFS } from '../algorithms/fcfs/fcfsScheduling.js';
import { calculateWaitingTime, calculateTurnaroundTime, calculateThroughput } from '../metrics/index.js';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  PieController,
  BarController,
  LineController
} from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm';

Chart.register(
  PieController,
  BarController,
  LineController,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

async function getRecommendedAlgorithm(features) {
  try {
    const response = await fetch('https://cpuschedulerbackend.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features)
    });

    const result = await response.json();
    alert(`Recommended Algorithm: ${result.recommended_algorithm}`);
    return result.recommended_algorithm;
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    alert('Failed to fetch recommendation from backend.');
  }
}

function updateAlgorithmDescription(selectedAlgorithm) {
  const descriptions = document.querySelectorAll('.algorithm-info');
  descriptions.forEach(desc => (desc.style.display = 'none'));

  const descSelectorMap = {
    'rr': '.rr-info',
    'fcfs': '.fcfs-info',
    'sjf-np': '.sjf-np-info',
    'sjf-p': '.sjf-p-info',
    'priority-np': '.priority-np-info',
    'priority-p': '.priority-p-info'
  };

  const selectedDesc = descSelectorMap[selectedAlgorithm];
  if (selectedDesc) {
    const descElement = document.querySelector(selectedDesc);
    if (descElement) {
      descElement.style.display = 'block';
    }
  }
}

function initializeCharts() {
  const selectionPieCtx = document.getElementById('selectionPieChart')?.getContext('2d');
  if (selectionPieCtx) {
    new Chart(selectionPieCtx, {
      type: 'pie',
      data: {
        labels: ['SRTF', 'SJF', 'Priority'],
        datasets: [{
          data: [60, 25, 15],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b']
        }]
      }
    });
  }

  const burstBarCtx = document.getElementById('burstBarChart')?.getContext('2d');
  if (burstBarCtx) {
    new Chart(burstBarCtx, {
      type: 'bar',
      data: {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
          { label: 'SRTF', data: [75, 55, 40], backgroundColor: '#6366f1' },
          { label: 'SJF', data: [20, 30, 40], backgroundColor: '#10b981' },
          { label: 'Priority', data: [5, 10, 15], backgroundColor: '#f59e0b' }
        ]
      }
    });
  }

  const waitLineCtx = document.getElementById('waitLineChart')?.getContext('2d');
  if (waitLineCtx) {
    new Chart(waitLineCtx, {
      type: 'line',
      data: {
        labels: ['5', '10', '15', '20', '25'],
        datasets: [
          { label: 'SRTF', data: [2.8, 3.0, 3.2, 3.4, 3.6], borderColor: '#6366f1', fill: false },
          { label: 'SJF', data: [3.5, 3.8, 4.2, 4.6, 5.0], borderColor: '#10b981', fill: false },
          { label: 'Priority', data: [4.2, 4.8, 5.5, 6.0, 6.6], borderColor: '#f59e0b', fill: false }
        ]
      }
    });
  }

  const efficiencyBarCtx = document.getElementById('efficiencyBarChart')?.getContext('2d');
  if (efficiencyBarCtx) {
    new Chart(efficiencyBarCtx, {
      type: 'bar',
      data: {
        labels: ['SRTF', 'SJF', 'Priority'],
        datasets: [
          { label: 'CPU Utilization (%)', data: [92, 87, 78], backgroundColor: '#6366f1' },
          { label: 'Throughput (processes/unit time)', data: [85, 75, 65], backgroundColor: '#10b981' }
        ]
      }
    });
  }

  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const buttons = tabContainer.querySelectorAll('.tab-button');
    const contents = tabContainer.parentElement.querySelectorAll('.tab-content');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        contents.forEach(content => content.classList.remove('active'));
        const target = button.getAttribute('data-target');
        document.getElementById(target)?.classList.add('active');
      });
    });
  });
}

function showError(message, containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerText = message;
    container.style.display = 'block';
    setTimeout(() => {
      container.innerText = '';
      container.style.display = 'none';
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const processForm = document.getElementById('process-form');
  const addProcessBtn = document.getElementById('add-process');
  const calculateBtn = document.getElementById('calculate');
  const recommendBtn = document.createElement('button');
  recommendBtn.innerText = 'Recommend Algorithm';
  recommendBtn.type = 'button';
  recommendBtn.id = 'recommend-algorithm';

  const algorithmSelect = document.getElementById('algorithm');
  const quantumInput = document.getElementById('time-quantum');
  const processesContainer = document.getElementById('processes');
  const resultsContainer = document.getElementById('results');

  processForm.querySelector('.button-group').appendChild(recommendBtn);
  initializeCharts();

  // Add initial process row only once
  addProcessBtn.click();

  algorithmSelect.addEventListener('change', () => {
    const quantumContainer = document.getElementById('quantum-container');
    const isPriority = algorithmSelect.value === 'priority-np' || algorithmSelect.value === 'priority-p';
    quantumContainer.style.display = algorithmSelect.value === 'rr' ? 'block' : 'none';

    const priorityHeaders = document.querySelectorAll('.priority-header');
    const priorityInputs = document.querySelectorAll('.priority-input');

    priorityHeaders.forEach(header => {
      header.style.display = isPriority ? 'block' : 'none';
    });

    priorityInputs.forEach(input => {
      input.style.display = isPriority ? 'block' : 'none';
    });

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

    updateAlgorithmDescription(algorithmSelect.value);
  });

  // Dispatch change event to set initial state correctly
  algorithmSelect.dispatchEvent(new Event('change'));
  updateAlgorithmDescription(algorithmSelect.value);

  addProcessBtn.addEventListener('click', () => {
    const processCount = document.querySelectorAll('.process-row').length;
    const newProcess = document.createElement('div');
    newProcess.className = 'process-row';

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

    newProcess.querySelector('.remove-process').addEventListener('click', () => {
      newProcess.remove();
      document.querySelectorAll('.process-row').forEach((row, index) => {
        row.querySelector('[name="process-id"]').value = `P${index}`;
      });
    });
  });

  recommendBtn.addEventListener('click', () => {
    const rows = document.querySelectorAll('.process-row');
    const numProcesses = rows.length;

    if (numProcesses === 0) {
      showError('Please add at least one process to get a recommendation.', 'form-error');
      return;
    }

    const arrivalTimes = [];
    const burstTimes = [];
    const priorities = [];

    rows.forEach(row => {
      arrivalTimes.push(parseFloat(row.querySelector('[name="arrival-time"]').value));
      burstTimes.push(parseFloat(row.querySelector('[name="burst-time"]').value));
      const priorityInput = row.querySelector('[name="priority"]');
      if (priorityInput && priorityInput.style.display !== 'none') {
        priorities.push(parseFloat(priorityInput.value));
      }
    });

    const avgArrival = arrivalTimes.reduce((a, b) => a + b, 0) / numProcesses;
    const avgBurst = burstTimes.reduce((a, b) => a + b, 0) / numProcesses;
    const avgPriority = priorities.length > 0 ? priorities.reduce((a, b) => a + b, 0) / priorities.length : 0;

    const stdBurst = Math.sqrt(burstTimes.map(b => Math.pow(b - avgBurst, 2)).reduce((a, b) => a + b, 0) / numProcesses);

    const features = {
      avg_arrival: avgArrival,
      avg_burst: avgBurst,
      avg_priority: avgPriority,
      std_burst: stdBurst,
      num_processes: numProcesses
    };

    console.log('Sending features to backend:', features);
    getRecommendedAlgorithm(features).then(recommended => {
      if (recommended) {
        switch (recommended) {
          case 'FCFS': algorithmSelect.value = 'fcfs'; break;
          case 'SJF': algorithmSelect.value = 'sjf-np'; break;
          case 'SRTF': algorithmSelect.value = 'sjf-p'; break;
        }
        updateAlgorithmDescription(algorithmSelect.value);
        algorithmSelect.dispatchEvent(new Event('change'));
      }
    });
  });

  calculateBtn.addEventListener('click', () => {
    const algorithm = algorithmSelect.value;
    const processes = [];
    let isValid = true;

    document.querySelectorAll('.process-row').forEach(row => {
      const arrivalTime = parseInt(row.querySelector('[name="arrival-time"]').value, 10);
      const burstTime = parseInt(row.querySelector('[name="burst-time"]').value, 10);
      let priority = null;

      if (algorithm === 'priority-np' || algorithm === 'priority-p') {
        const priorityInput = row.querySelector('[name="priority"]');
        priority = parseInt(priorityInput.value, 10);
        if (isNaN(priority) || priority < 1) {
          isValid = false;
          showError(`Invalid priority for ${row.querySelector('[name="process-id"]').value}! Priority must be a positive integer.`, 'form-error');
          return;
        }
      }

      if (arrivalTime < 0 || burstTime <= 0 || isNaN(arrivalTime) || isNaN(burstTime)) {
        isValid = false;
        showError('Invalid values detected! Arrival time must be >= 0 and burst time must be > 0.', 'form-error');
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

    if (!isValid) return;

    if (processes.length === 0) {
      showError('Please add at least one process.', 'form-error');
      return;
    }

    let schedule, completionTimes;

    try {
      if (algorithm === 'rr') {
        const quantum = parseInt(quantumInput.value, 10);
        if (isNaN(quantum) || quantum < 1) {
          showError('Please enter a valid time quantum.', 'time-quantum-error');
          return;
        }
        const result = calculateRoundRobin(processes, quantum);
        schedule = result.schedule;
        completionTimes = result.completionTimes;
      } else if (algorithm === 'fcfs') {
        const result = calculateFCFS(processes);
        schedule = result.schedule;
        completionTimes = result.completionTimes;
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

      const waitingTimes = calculateWaitingTime(processes, completionTimes);
      const turnaroundTimes = calculateTurnaroundTime(processes, completionTimes);
      const throughput = calculateThroughput(processes, completionTimes);

      resultsContainer.innerHTML = '';
      renderGanttChart(resultsContainer, schedule);
      renderMetricsTable(resultsContainer, processes, waitingTimes, turnaroundTimes, throughput);
    } catch (error) {
      console.error('Error in calculation:', error);
      showError('There was an error calculating the results. Check the console for details.', 'form-error');
    }
  });

  // Removed duplicate addProcessBtn.click() to avoid redundancy
});
