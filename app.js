let filtered = seats;

function filterData() {
  const region = document.getElementById("regionFilter").value;
  filtered = region === "All" ? seats : seats.filter(s => s.region === region);
  renderAll();
}

document.getElementById("regionFilter").addEventListener("change", filterData);

function renderAll() {
  renderTable();
  renderKPIs();
  renderCharts();
}

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

function renderKPIs() {
  const total = filtered.length;
  const high = filtered.filter(s=>s.volatility==="HIGH").length;

  const avgMargin = Math.round(filtered.reduce((a,b)=>a+b.margin,0)/total);
  const avgSIR = Math.round(filtered.reduce((a,b)=>a+b.sir,0)/total);

  document.getElementById("total").innerText = total;
  document.getElementById("high").innerText = high;
  document.getElementById("margin").innerText = avgMargin;
  document.getElementById("sir").innerText = avgSIR;
}

let scatterChart, pieChart;

function renderCharts() {

  scatterChart = new Chart(document.getElementById("scatterChart"), {
  type: 'scatter',
  data: {
    datasets: [{
      label: 'Seats',
      data: scatterData,
      backgroundColor: '#F97316'
    }]
  }
});

  const scatterData = filtered.map(s => ({
    x: s.margin,
    y: s.sir
  }));

  if (scatterChart) scatterChart.destroy();
  scatterChart = new Chart(document.getElementById("scatterChart"), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Seats',
        data: scatterData,
        backgroundColor: '#F97316'
      }]
    }
  });

  const counts = {
    HIGH: filtered.filter(s=>s.volatility==="HIGH").length,
    MEDIUM: filtered.filter(s=>s.volatility==="MEDIUM").length,
    LOW: filtered.filter(s=>s.volatility==="LOW").length
  };

  if (pieChart) pieChart.destroy();
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

window.onload = renderAll;
