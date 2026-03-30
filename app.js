/ ======================
// GLOBAL STATE
// ======================
let filtered = seats;
let scatterChart = null;
let pieChart = null;

// ======================
// FILTER HANDLER
// ======================
function filterData() {
  const region = document.getElementById("regionFilter").value;

  filtered = region === "All"
    ? seats
    : seats.filter(s => s.region === region);

  renderAll();
}

// Attach filter listener AFTER page loads
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("regionFilter").addEventListener("change", filterData);
  renderAll();
});

// ======================
// MASTER RENDER
// ======================
function renderAll() {
  renderKPIs();
  renderTable();
  renderCharts();
}

// ======================
// KPI SECTION
// ======================
function renderKPIs() {
  const total = filtered.length;

  const high = filtered.filter(s => s.volatility === "HIGH").length;

  const avgMargin = total
    ? Math.round(filtered.reduce((a, b) => a + b.margin, 0) / total)
    : 0;

  const avgSIR = total
    ? Math.round(filtered.reduce((a, b) => a + b.sir, 0) / total)
    : 0;

  document.getElementById("total").innerText = total;
  document.getElementById("high").innerText = high;
  document.getElementById("margin").innerText = avgMargin;
  document.getElementById("sir").innerText = avgSIR;
}

// ======================
// TABLE
// ======================
function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  filtered.forEach(s => {
    const row = `
      <tr>
        <td>${s.seat}</td>
        <td>${s.region}</td>
        <td>${s.margin}</td>
        <td>${s.sir}</td>
        <td>${s.ratio}</td>
        <td class="${s.volatility}">${s.volatility}</td>
        <td class="${s.flip}">${s.flip}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ======================
// CHARTS
// ======================
function renderCharts() {

  // Prepare scatter data
  const scatterData = filtered.map(s => ({
    x: s.margin,
    y: s.sir
  }));

  // Destroy old charts (important)
  if (scatterChart) scatterChart.destroy();
  if (pieChart) pieChart.destroy();

  // ======================
  // SCATTER CHART
  // ======================
  scatterChart = new Chart(document.getElementById("scatterChart"), {
    type: "scatter",
    data: {
      datasets: [{
        label: "Seats",
        data: scatterData,
        backgroundColor: filtered.map(s => {
          if (s.volatility === "HIGH") return "#F97316";   // Orange
          if (s.volatility === "MEDIUM") return "#2563EB"; // Blue
          return "#16A34A";                                // Green
        })
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const s = filtered[context.dataIndex];
              return `${s.seat} | Margin: ${s.margin} | SIR: ${s.sir}`;
            }
          }
        },
        legend: {
          labels: {
            color: "#ffffff"
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Winning Margin",
            color: "#aaa"
          },
          ticks: {
            color: "#aaa"
          }
        },
        y: {
          title: {
            display: true,
            text: "SIR Changes",
            color: "#aaa"
          },
          ticks: {
            color: "#aaa"
          }
        }
      }
    }
  });

  // ======================
  // PIE CHART
  // ======================
  const counts = {
    HIGH: filtered.filter(s => s.volatility === "HIGH").length,
    MEDIUM: filtered.filter(s => s.volatility === "MEDIUM").length,
    LOW: filtered.filter(s => s.volatility === "LOW").length
  };

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["High Risk", "Medium", "Low"],
      datasets: [{
        data: [counts.HIGH, counts.MEDIUM, counts.LOW],
        backgroundColor: ["#F97316", "#2563EB", "#16A34A"]
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#ffffff"
          }
        }
      }
    }
  });
}
