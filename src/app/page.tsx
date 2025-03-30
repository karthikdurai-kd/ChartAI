"use client";
import { useState } from "react";
import axios from "axios";
import BarChart from "./components/BarChart";
import {
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Papa from "papaparse";

interface ChartData {
  [key: string]: string | number;
}

export default function Home() {
  const [data, setData] = useState<ChartData[]>([]);
  const [chartType, setChartType] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [labelColumn, setLabelColumn] = useState<string>("");
  const [valueColumn, setValueColumn] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle CSV File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result: { data: ChartData[] }) => {
        setLoading(false);
        setData(result.data); // Store CSV data

        const columnNames = Object.keys(result.data[0]); // Extract column names
        setColumns(columnNames); // Store available columns

        // Send CSV data to LLM to get a suggested chart type
        fetchChartSuggestion(result.data);
      },
      error: (error) => {
        setLoading(false);
        setErrorMessage("Error parsing CSV file");
        setOpenSnackbar(true);
      },
    });
  };

  // Fetch Suggested Chart Type from LLM
  const fetchChartSuggestion = async (dataset: ChartData[]) => {
    try {
      const response = await axios.post("/api/getChartType", { dataset });
      const fetchedChartType = response.data.chartType.trim();

      setChartType(fetchedChartType); // Update chart type got from LLM
    } catch (error) {
      setErrorMessage("Error fetching chart suggestions");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, textAlign: "center" }}>
      <h1>AI-Powered Chart Selector</h1>

      {/* File Upload Section */}
      <Button
        variant="contained"
        component="label"
        sx={{
          mb: 3,
          fontSize: "16px",
          padding: "10px 20px",
          marginTop: "15px",
        }}
      >
        Upload CSV
        <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
      </Button>

      {/* Loading Spinner */}
      {loading && (
        <CircularProgress sx={{ display: "block", margin: "0 auto" }} />
      )}

      {/* Display Column Selection Dropdowns */}
      {!loading && columns.length > 0 && (
        <div>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="label-select">Label Column</InputLabel>
            <Select
              labelId="label-select"
              value={labelColumn}
              onChange={(e) => setLabelColumn(e.target.value)}
              sx={{ fontSize: "16px" }}
            >
              {columns.map((column) => (
                <MenuItem key={column} value={column}>
                  {column}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="value-select">Value Column</InputLabel>
            <Select
              labelId="value-select"
              value={valueColumn}
              onChange={(e) => setValueColumn(e.target.value)}
              sx={{ fontSize: "16px" }}
            >
              {columns.map((column) => (
                <MenuItem key={column} value={column}>
                  {column}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}

      {/* Display Suggested Chart Type */}
      {chartType && !loading && <p>Suggested Chart: {chartType}</p>}

      {/* Render BarChart */}
      {chartType === "Bar" && labelColumn && valueColumn && !loading && (
        <div style={{ marginTop: "30px" }}>
          <BarChart
            data={data.map((row) => ({
              label: String(row[labelColumn]),
              value: Number(row[valueColumn]),
            }))}
            labelColumn={labelColumn}
            valueColumn={valueColumn}
          />
        </div>
      )}

      {/* Snackbar for error handling */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
