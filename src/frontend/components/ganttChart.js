// // src/frontend/components/ganttChart.js

// /**
//  * Renders a Gantt chart visualization for the CPU scheduling
//  * @param {HTMLElement} container - The DOM element to render the chart into
//  * @param {Array} schedule - Array of scheduling events with processId, startTime, endTime
//  */
// export function renderGanttChart(container, schedule) {
//   if (!container || !Array.isArray(schedule) || schedule.length === 0) {
//     console.error("Invalid Gantt chart input.");
//     return;
//   }

//   // Create a section for the Gantt chart
//   const ganttSection = document.createElement('div');
//   ganttSection.className = 'gantt-chart';
//   ganttSection.innerHTML = '<h3>Gantt Chart</h3>';

//   // Main containers
//   const ganttContainer = document.createElement('div');
//   ganttContainer.className = 'gantt-container';

//   const timelineContainer = document.createElement('div');
//   timelineContainer.className = 'timeline-container';

//   // Determine the earliest (min) and latest (max) times
//   const minTime = Math.min(...schedule.map(item => item.startTime));
//   const maxTime = Math.max(...schedule.map(item => item.endTime));
//   let totalTime = maxTime - minTime;

//   // Prevent division by zero if all processes have the same start/end
//   if (totalTime < 1) {
//     totalTime = 1;
//   }

//   // Set a fixed maximum width (in px) to keep the chart contained
//   const MAX_WIDTH = 800;
//   const scaleFactor = MAX_WIDTH / totalTime;

//   // Force the container widths to our fixed maximum
//   ganttContainer.style.width = `${MAX_WIDTH}px`;
//   timelineContainer.style.width = `${MAX_WIDTH}px`;

//   // Create Gantt blocks for each scheduled segment
//   schedule.forEach(item => {
//     const { processId, startTime, endTime } = item;
//     const duration = endTime - startTime;

//     // Create a block for the process segment
//     const block = document.createElement('div');
//     block.className = 'gantt-block';

//     // Position the block relative to the earliest time
//     block.style.left = `${(startTime - minTime) * scaleFactor}px`;
//     block.style.width = `${duration * scaleFactor}px`;

//     // Show the process ID as text (optional)
//     block.innerText = processId;

//     // Tooltip with more details
//     block.title = `${processId}: ${startTime} - ${endTime} (Duration: ${duration})`;

//     ganttContainer.appendChild(block);
//   });

//   // We only want timeline marks at CPU switches (start or end times)
//   // Gather all unique switch times into a sorted array
//   const switchTimesSet = new Set();
//   schedule.forEach(item => {
//     switchTimesSet.add(item.startTime);
//     switchTimesSet.add(item.endTime);
//   });
//   const switchTimes = [...switchTimesSet].sort((a, b) => a - b);

//   // Create a timeline mark for each switch time
//   switchTimes.forEach(time => {
//     const mark = document.createElement('div');
//     mark.className = 'timeline-mark';
//     mark.style.left = `${(time - minTime) * scaleFactor}px`;
//     mark.innerText = time;
//     timelineContainer.appendChild(mark);
//   });

//   // Append everything to the container
//   ganttSection.appendChild(ganttContainer);
//   ganttSection.appendChild(timelineContainer);
//   container.appendChild(ganttSection);
// }
