// src/frontend/components/ganttChart.js

/**
 * Renders a Gantt chart visualization for the CPU scheduling
 * @param {HTMLElement} container - The DOM element to render the chart into
 * @param {Array} schedule - Array of scheduling events with process id and time
 */
export function renderGanttChart(container, schedule) {
  if (!container || !Array.isArray(schedule) || schedule.length === 0) {
    console.error("Invalid Gantt chart input.");
    return;
  }

  const ganttSection = document.createElement('div');
  ganttSection.className = 'gantt-chart';
  ganttSection.innerHTML = '<h3>Gantt Chart</h3>';

  const ganttContainer = document.createElement('div');
  ganttContainer.className = 'gantt-container';

  const timelineContainer = document.createElement('div');
  timelineContainer.className = 'timeline-container';

  // Determine min & max times
  const minTime = Math.min(...schedule.map(item => item.startTime));
  const maxTime = Math.max(...schedule.map(item => item.endTime));
  const totalTime = maxTime - minTime;

  // Decide how many pixels per unit of time
  // e.g., try to fit chart in 500px or use a set ratio
  const scaleFactor = Math.max(500 / (totalTime || 1), 10);

  // Set container width so the timeline marks don’t overflow
  ganttContainer.style.width = `${totalTime * scaleFactor}px`;
  timelineContainer.style.width = `${totalTime * scaleFactor}px`;

  // Create blocks for each process
  schedule.forEach(item => {
    const { processId, startTime, endTime } = item;
    const duration = endTime - startTime;

    // Create a block
    const block = document.createElement('div');
    block.className = 'gantt-block';
    // Position based on actual time
    block.style.left = `${(startTime - minTime) * scaleFactor}px`;
    block.style.width = `${duration * scaleFactor}px`;

    block.innerText = processId;
    block.title = `${processId}: ${startTime} - ${endTime} (Duration: ${duration})`;

    ganttContainer.appendChild(block);
  });

  // Create timeline marks (one for each integer time, or only starts—your choice)
  for (let t = minTime; t <= maxTime; t++) {
    const mark = document.createElement('div');
    mark.className = 'timeline-mark';
    mark.style.left = `${(t - minTime) * scaleFactor}px`;
    mark.innerText = t;
    timelineContainer.appendChild(mark);
  }

  ganttSection.appendChild(ganttContainer);
  ganttSection.appendChild(timelineContainer);
  container.appendChild(ganttSection);
}
