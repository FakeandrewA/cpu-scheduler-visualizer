// src/frontend/components/ganttChart.js

/**
 * Renders a Gantt chart visualization for the CPU scheduling
 * @param {HTMLElement} container - The DOM element to render the chart into
 * @param {Array} schedule - Array of scheduling events with process id and time
 */
export function renderGanttChart(container, schedule) {
  const ganttSection = document.createElement('div');
  ganttSection.className = 'gantt-chart';
  ganttSection.innerHTML = '<h3>Gantt Chart</h3>';
  
  const ganttContainer = document.createElement('div');
  ganttContainer.className = 'gantt-container';
  
  const timelineContainer = document.createElement('div');
  timelineContainer.className = 'timeline-container';
  
  let currentTime = 0;
  
  // Create a block for each process execution
  schedule.forEach(item => {
    const { processId, startTime, endTime } = item;
    const duration = endTime - startTime;
    
    // Create a block in the Gantt chart
    const block = document.createElement('div');
    block.className = 'gantt-block';
    block.style.width = `${duration * 30}px`; // Scale factor for visualization
    block.innerText = processId;
    block.title = `${processId}: ${startTime} - ${endTime} (Duration: ${duration})`;
    ganttContainer.appendChild(block);
    
    // Add timeline marks
    if (currentTime === 0 || currentTime !== startTime) {
      const mark = document.createElement('div');
      mark.className = 'timeline-mark';
      mark.style.left = `${(currentTime === 0 ? 0 : startTime) * 30}px`;
      mark.innerText = startTime;
      timelineContainer.appendChild(mark);
    }
    
    currentTime = endTime;
  });
  
  // Add the final time mark
  const finalMark = document.createElement('div');
  finalMark.className = 'timeline-mark';
  finalMark.style.left = `${currentTime * 30}px`;
  finalMark.innerText = currentTime;
  timelineContainer.appendChild(finalMark);
  
  ganttSection.appendChild(ganttContainer);
  ganttSection.appendChild(timelineContainer);
  container.appendChild(ganttSection);
}
