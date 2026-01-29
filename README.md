# 🎯 Retire Planner - Your Financial Independence

A beautiful, interactive retirement planning calculator that helps you visualize your financial future and plan for financial independence.

![Retire Planner](https://img.shields.io/badge/React-19.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.4-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-38bdf8)

## ✨ Features

- **📊 Interactive Visualization**: Real-time graph showing projected vs recommended savings trajectory
- **🎛️ Intuitive Controls**: Easy-to-use sliders for all financial inputs
- **💡 Smart Advisor**: Personalized recommendations based on your financial situation
- **📈 Detailed Analysis**: Breakdown of retirement targets and projected outcomes
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Beautiful UI**: Clean, modern interface with smooth animations

## 🚀 Live Demo

[View Live Demo](https://your-vercel-url.vercel.app) *(Update after deployment)*

## 📸 Screenshots

### Main Dashboard
![Main Dashboard](screenshots/dashboard.png)

### Interactive Graph
![Graph Visualization](screenshots/graph.png)

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.19
- **Icons**: Lucide React 0.563.0
- **Deployment**: Vercel

## 📁 Project Structure

```
retire-planner/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md           # This file
```

## 🧪 Features in Detail

### Input Parameters
- **Current Age**: Your present age
- **Current Savings**: Total retirement savings to date
- **Retire Age**: Target retirement age
- **Income**: Annual household income
- **Monthly Savings**: Amount saved monthly
- **Retirement Expenses**: Expected annual spending in retirement

### Calculations
- Pre-retirement growth rate: 6%
- Post-retirement growth rate: 4%
- Inflation rate: 3%
- Projected savings trajectory
- Recommended savings path
- Retirement adequacy ratio

### Visual Feedback
- **😎 Excellent**: On track for early retirement
- **🙂 Good**: On track for retirement goals
- **🤔 Fair**: May need adjustments
- **😨 Risk**: Savings below target

## 🚀 Getting Started Locally

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/retire-planner.git
cd retire-planner
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deploying to Vercel

### Automatic Deployment (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub account
   - Select this repository
   - Click "Deploy"

Vercel will automatically detect the Vite configuration and deploy your app.

### Manual Deployment

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
vercel --prod
```

## ⚙️ Configuration

### Environment Variables

This project doesn't require any environment variables. All calculations are done client-side.

### Customization

You can modify the following parameters in `src/App.jsx`:

```javascript
const growthRate = 0.06;        // Pre-retirement return (6%)
const growthRateRetired = 0.04; // Post-retirement return (4%)
const inflationRate = 0.03;     // Inflation assumption (3%)
const endAge = 95;              // Projection end age
```

## 📊 Model Assumptions

- **Pre-Retirement**: 6% annual return
- **Post-Retirement**: 4% conservative return
- **Inflation**: 3% annual inflation
- **Time Horizon**: Age 95
- **Withdrawal Method**: Safe withdrawal with inflation adjustment

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons by [Lucide](https://lucide.dev)
- Hosted on [Vercel](https://vercel.com)

## 📧 Contact

For questions, suggestions, or issues:
- Open an issue on GitHub
- Email: your-email@example.com

## 🗺️ Roadmap

- [ ] Add multiple retirement scenarios comparison
- [ ] Export data as PDF report
- [ ] Save/load user profiles
- [ ] Add inflation-adjusted projections
- [ ] Include Social Security estimates
- [ ] Multi-currency support

---

**Note**: This tool is for educational purposes only and should not be considered financial advice. Please consult a qualified financial advisor for personalized retirement planning.

Made with ❤️ for your financial freedom
