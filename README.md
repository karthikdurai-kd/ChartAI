# ChartAI

### 📊 AI-Powered CSV Chart Selector

This project allows users to upload a CSV file and utilizes AI to suggest an appropriate chart type based on the uploaded data. Users can select columns to include in the chart, which is then built instantly. The application is developed using Next.js, D3.js, Material UI, and Papaparse for seamless data visualization and interactivity.

---

## 🚀 Features

✅ **AI-Suggested Chart Type** – Automatically recommends a chart type based on CSV data.  
✅ **CSV Upload & Parsing** – Handles structured data input using Papaparse.  
✅ **Interactive D3.js Charts** – Displays real-time data visualization with smooth animations.  
✅ **Tooltips & Hover Effects** – Provides additional insights with an intuitive UI.  
✅ **Custom Column Selection** – Allows users to map data fields for flexibility.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript
- **UI Components**: Material UI
- **Charting Library**: D3.js
- **CSV Parsing**: Papaparse
- **AI Integration**: Google Gemini AI

---

## 🎯 How It Works

1️⃣ **Upload a CSV File**

- Ensure the CSV has a structured format with headers.

2️⃣ **AI-Suggested Chart Type**

- The application analyzes the dataset and recommends the best visualization type.

3️⃣ **Select Data Columns**

- Choose which columns to use for labels and values.

4️⃣ **Generate a Chart**

- The chart is rendered dynamically using **D3.js**.

5️⃣ **Interactive Experience**

- Hover over bars to view tooltips with precise data points.

---

## 🏗️ Installation & Setup

```sh
# Clone the repository
git clone https://github.com/karthikdurai-kd/ChartAI.git

# Navigate to the project folder
cd ChartAI

# Install dependencies
npm install

# Create a .env.local file and add your Google Gemini API key
touch .env.local
echo "GEMINI_API_KEY=your_actual_gemini_api_key" >> .env.local

# Start the development server
npm run dev
```

---
