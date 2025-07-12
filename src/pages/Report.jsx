import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Colors/Themes";
import { Line, PolarArea, Doughnut, Bar, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PolarAreaController,
  RadialLinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports } from "../stores/reportSlice";

ChartJS.register(
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PolarAreaController,
  RadialLinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const Report = () => {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  // Extracted data from API response
  const invoiceChart = data?.invoices?.map((invoice) => invoice.total) || [];
  const pendChart = data?.invoices?.map((invoice) => invoice.debt) || [];
  const labChart = data?.labs?.map((lab) => lab.price) || [];
  const materialChart =
    data?.materials?.map((material) => material.price) || [];

  // Process patient data for histogram (count occurrences of each name)
  const patientCounts = invoiceChart.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const debtCounts = pendChart.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  // Patient Histogram Data
  const patientHistogramData = {
    labels: Object.keys(patientCounts),
    datasets: [
      {
        label: "Patient Visits",
        data: Object.values(patientCounts),
        backgroundColor: isDark
          ? "rgba(59, 130, 246, 0.7)"
          : "rgba(59, 130, 246, 0.5)",
        borderColor: isDark ? "#3b82f6" : "#1d4ed8",
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: isDark ? "#3b82f6" : "#2563eb",
      },
    ],
  };
  const debtHistogramData = {
    labels: Object.keys(debtCounts),
    datasets: [
      {
        label: "Patient Visits",
        data: Object.values(debtCounts),
        backgroundColor: isDark
          ? "rgba(59, 130, 246, 0.7)"
          : "rgba(59, 130, 246, 0.5)",
        borderColor: isDark ? "#3b82f6" : "#1d4ed8",
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: isDark ? "#3b82f6" : "#2563eb",
      },
    ],
  };

  // Lab Polar Area Chart Data
  const labPolarData = {
    labels: labChart.map((_, index) => `Lab Test ${index + 1}`),
    datasets: [
      {
        data: labChart,
        backgroundColor: labChart.map((_, i) =>
          isDark
            ? `rgba(${100 + i * 30}, ${50 + i * 20}, ${150 + i * 10}, 0.7)`
            : `rgba(${50 + i * 40}, ${100 + i * 10}, ${200 - i * 20}, 0.7)`
        ),
        borderColor: isDark ? "#1f2937" : "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Material Line Chart Data
  const materialRadarData = {
    labels: materialChart.map((_, index) => `Material ${index + 1}`),
    datasets: [
      {
        label: "Material Prices ($)",
        data: materialChart,
        backgroundColor: isDark
          ? "rgba(74, 222, 128, 0.2)"
          : "rgba(16, 185, 129, 0.2)",
        borderColor: isDark ? "#4ade80" : "#10b981",
        pointBackgroundColor: isDark ? "#4ade80" : "#10b981",
        pointBorderColor: isDark ? "#1f2937" : "#fff",
        pointHoverBackgroundColor: isDark ? "#86efac" : "#34d399",
        pointHoverBorderColor: isDark ? "#1f2937" : "#fff",
        borderWidth: 2, // Slightly thinner for radar charts
        pointRadius: materialChart.length > 10 ? 3 : 5,
        pointHoverRadius: 8,
        fill: true, // Enable fill for radar charts
        tension: 0.1, // Lower tension for radar charts
      },
    ],
  };

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#e5e7eb" : "#4b5563",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1f2937" : "#fff",
        titleColor: isDark ? "#e5e7eb" : "#111827",
        bodyColor: isDark ? "#e5e7eb" : "#4b5563",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        usePointStyle: true,
      },
    },
  };

  const histogramOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
        },
      },
      x: {
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
        },
      },
    },
  };

  const polarOptions = {
    ...commonOptions,
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
          showLabelBackdrop: false,
          callback: (value) => value,
        },
      },
    },
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        position: "right",
      },
    },
  };
  return (
    <div
      className={`p-6 min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Dental Clinic Report</h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Patient Histogram Chart */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 rounded-xl shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-4">Patient total payment </h3>
          <div className="h-80">
            <Bar data={patientHistogramData} options={histogramOptions} />
          </div>
        </div>
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 rounded-xl shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-4">Patient total debt </h3>
          <div className="h-80">
            <Bar data={debtHistogramData} options={histogramOptions} />
          </div>
        </div>

        {/* Lab Polar Area Chart */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 rounded-xl shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Lab Test Prices Distribution
          </h3>
          <div className="h-80">
            <PolarArea data={labPolarData} options={polarOptions} />
          </div>
        </div>
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 rounded-xl shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Material Test Prices Distribution
          </h3>
          <div className="h-80">
            <PolarArea data={materialRadarData} options={polarOptions} />
          </div>
        </div>
      </div>

      {/* Second Row - Material Line Chart */}
    </div>
  );
};

export default Report;
