// src/frontend/components/metricsTable.js

/**
 * Renders a table displaying performance metrics for the scheduling algorithm
 * @param {HTMLElement} container - The DOM element to render the table into
 * @param {Array} processes - Array of process objects
 * @param {Object} waitingTimes - Object mapping process IDs to waiting times
 * @param {Object} turnaroundTimes - Object mapping process IDs to turnaround times
 * @param {number} throughput - The throughput metric value
 */
export function renderMetricsTable(container, processes, waitingTimes, turnaroundTimes, throughput) {
  const metricsSection = document.createElement('div');
  metricsSection.innerHTML = '<h3>Performance Metrics</h3>';
  
  // Create process metrics table
  const table = document.createElement('table');
  table.className = 'metrics-table';
  
  // Create table header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Process ID</th>
      <th>Arrival Time</th>
      <th>Burst Time</th>
      <th>Waiting Time</th>
      <th>Turnaround Time</th>
    </tr>
  `;
  table.appendChild(thead);
  
  // Create table body
  const tbody = document.createElement('tbody');
  
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  
  // Add a row for each process
  processes.forEach(process => {
    const { id, arrivalTime, burstTime } = process;
    const waitingTime = waitingTimes[id];
    const turnaroundTime = turnaroundTimes[id];
    
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${id}</td>
      <td>${arrivalTime}</td>
      <td>${burstTime}</td>
      <td>${waitingTime}</td>
      <td>${turnaroundTime}</td>
    `;
    tbody.appendChild(row);
  });
  
  // Add summary row with averages
  const averageRow = document.createElement('tr');
  averageRow.className = 'average-row';
  averageRow.innerHTML = `
    <td colspan="3">Average</td>
    <td>${(totalWaitingTime / processes.length).toFixed(2)}</td>
    <td>${(totalTurnaroundTime / processes.length).toFixed(2)}</td>
  `;
  tbody.appendChild(averageRow);
  
  table.appendChild(tbody);
  metricsSection.appendChild(table);
  
  // Display throughput
  const throughputInfo = document.createElement('div');
  throughputInfo.className = 'throughput-info';
  throughputInfo.innerHTML = `<p><strong>Throughput:</strong> ${throughput.toFixed(4)} processes/unit time</p>`;
  metricsSection.appendChild(throughputInfo);
  
  container.appendChild(metricsSection);
}
