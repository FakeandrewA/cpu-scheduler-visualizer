# Intelligent CPU Scheduler Visualizer

## Overview
**CPU Scheduler Visualizer** is an interactive web-based tool that simulates and visualizes different CPU scheduling algorithms. It helps users understand how processes are scheduled and provides insights into metrics like waiting time, turnaround time, and system throughput.

This project now includes an **AI-based recommendation system** to suggest the most efficient scheduling algorithm based on the given process set.

---

## Features

- 🔧 **Interactive Visualization** of popular CPU scheduling algorithms.
- 🤖 **AI-Based Recommendation Engine** suggests the optimal algorithm based on process characteristics.
- 🕐 **Supported Algorithms**
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Round Robin (RR)
  - Priority Scheduling (Non-Preemptive & Preemptive)
- 📊 **Performance Metrics Calculation**
  - Average Waiting Time
  - Average Turnaround Time
  - Throughput
- ✨ **User-Friendly Interface**
- 📈 **Graphical Analysis and Reports**

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/cpu-scheduler-visualizer.git
   cd cpu-scheduler-visualizer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Project Locally**
   ```bash
   npm start
   ```

4. **Access the App**
   Open https://fakeandrewa.github.io/cpu-scheduler-visualizer/src/frontend/ in your browser.

---

## How to Use

1. **Select** a scheduling algorithm or use the AI-based recommendation.
2. **Input** process details such as arrival time, burst time, and priority (if applicable).
3. **Run Simulation** to view the Gantt chart and scheduling visualization.
4. **Analyze** the metrics and performance insights.

---

## Project Structure (Simplified)

```
cpu-scheduler-visualizer/
├── .idea/                  # Project configuration files
├── docs/                  # Documentation (algorithms, API, etc.)
├── src/                   # Source code
│   ├── ai-model/          # AI-based recommendation engine
│   ├── algorithms/        # Scheduling algorithm implementations
│   ├── frontend/          # Frontend UI components, styles, utils
│   └── metrics/           # Performance metrics calculations
├── test/                  # Tests for frontend, algorithms, metrics
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md              # Project overview (this file)
```

---

## Contributing
We welcome contributions from the community! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact

- 📧 **Email**: andrewgtc2005@gmail.com
- 🐞 **Issues**: [GitHub Issues](https://github.com/FakeandrewA/cpu-scheduler-visualizer/issues)

---

Happy Coding! 🚀

