let filtered = seats;
let scatterChart = null;
let pieChart = null;

// FILTER
function filterData() {
  const region = document.getElementById("regionFilter").value;

  filtered = region === "All"
    ? seats
    : seats.filter(s => s.region === region);

  renderAll();
}

// INIT
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("regionFilter").addEventListener("change", filterData);
  renderAll();
});

// MAIN
function renderAll() {
  renderKPIs();
  renderTable();
  renderCharts();
}

// KPI
function renderKPIs() {
  const total = filtered.length;
  const high = filtered.filter(s => s.volatility === "HIGH").length;

  const avgMargin = total
    ? Math.round(filtered.reduce((a,b)=>a+b.margin,0)/total)
    : 0;

  const avgSIR = total
    ? Math.round(filtered.reduce((a,b)=>a+b.sir,0)/total)
    : 0;

  document.getElementById("total").innerText = total;
  document.getElementById("high").innerText = high;
  document.getElementById("margin").innerText = avgMargin;
  document.getElementById("sir").innerText = avgSIR;
}

// TABLE
function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  filtered.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.seat}</td>
        <td>${s.region}</td>
        <td>${s.margin}</td>
        <td>${s.sir}</td>
        <td>${s.ratio}</td>
        <td class="${s.volatility}">${s.volatility}</td>
        <td>${s.flip}</td>
      </tr>
    `;
  });
}

// CHARTS
function renderCharts() {

  const scatterData = filtered.map(s => ({
    x: s.margin,
    y: s.sir
  }));

  if (scatterChart) scatterChart.destroy();
  if (pieChart) pieChart.destroy();

  // SCATTER
  scatterChart = new Chart(document.getElementById("scatterChart"), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Seats',
        data: scatterData,
        backgroundColor: filtered.map(s => {
          if (s.volatility === "HIGH") return "#F97316";
          if (s.volatility === "MEDIUM") return "#2563EB";
          return "#16A34A";
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
        }
      }
    }
  });

  // PIE
  const counts = {
    HIGH: filtered.filter(s=>s.volatility==="HIGH").length,
    MEDIUM: filtered.filter(s=>s.volatility==="MEDIUM").length,
    LOW: filtered.filter(s=>s.volatility==="LOW").length
  };

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: 'pie',
    data: {
      labels: ["High","Medium","Low"],
      datasets: [{
        data: [counts.HIGH, counts.MEDIUM, counts.LOW],
        backgroundColor: ["#F97316","#2563EB","#16A34A"]
      }]
    }
  });
}
