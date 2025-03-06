# cpu-scheduler-visualizer
## Overview
CPU Scheduler Visualizer is an interactive web-based tool designed to simulate and visualize different CPU scheduling algorithms. This project helps users understand how processes are scheduled in an operating system, providing clear insights into waiting time, turnaround time, and overall system performance.

## Features
- Interactive visualization of scheduling algorithms
- Supports multiple scheduling algorithms:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Round Robin (RR)
  - Priority Scheduling (Non-Preemptive & Preemptive)
- Performance metrics calculations:
  - Waiting Time
  - Turnaround Time
  - Throughput
- Clean UI for an easy-to-understand representation of process execution

## Project Structure
```
cpu-scheduler-visualizer/
├── README.md                 # Project overview, setup instructions, contributor guidelines
├── CONTRIBUTING.md           # Contribution guidelines
├── .gitignore                # Files to ignore in git
├── src/                      # Source code directory
│   ├── frontend/             # Frontend code
│   │   ├── components/       # Reusable UI components
│   │   ├── styles/           # CSS/styling files
│   │   ├── utils/            # Helper functions
│   │   └── main.js           # Main entry point
│   ├── algorithms/           # Scheduling algorithm implementations
│   │   ├── round-robin/      # Round Robin (your responsibility)
│   │   ├── fcfs/             # First Come First Serve + Priority Scheduling (friend 1)
│   │   │   ├── fcfs.js
│   │   │   ├── priority.js
│   │   └── sjf/              # Shortest Job First (friend 2)
│   └── metrics/              # Performance metrics calculations
│       ├── waiting-time.js
│       ├── turnaround-time.js
│       ├── throughput.js
│       └── index.js
├── tests/                    # Test files
│   ├── frontend/
│   ├── algorithms/
│   └── metrics/
└── docs/                     # Documentation
    ├── algorithms/           # Algorithm explanations
    └── api/                  # API documentation
```

## Installation & Setup
### Prerequisites
- [Node.js](https://nodejs.org/) installed
- Git installed

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cpu-scheduler-visualizer.git
   cd cpu-scheduler-visualizer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the project locally:**
   ```bash
   npm start
   ```
4. **Open in your browser:**
   - The application should be running at `http://localhost:3000/`

## How to Use
1. Choose a scheduling algorithm from the list.
2. Input process details (arrival time, burst time, priority if applicable).
3. Click "Run Simulation" to visualize the scheduling.
4. View calculated performance metrics.

## Contributing
We welcome contributions! Check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## Contact
For any questions or suggestions, feel free to reach out:
- **GitHub Issues**: Submit a ticket on the repository.
- **Email**: your-email@example.com

Happy coding! 🚀
