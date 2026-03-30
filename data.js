const seats = [
  {seat:"Kulti", region:"Industrial", margin:679, ls:"BJP", sir:38000},
  {seat:"Asansol North", region:"Industrial", margin:8500, ls:"BJP", sir:22000},
  {seat:"Raniganj", region:"Industrial", margin:12000, ls:"BJP", sir:25000},
  {seat:"Durgapur East", region:"Industrial", margin:9500, ls:"BJP", sir:21000},
  {seat:"Pandaveswar", region:"Industrial", margin:11000, ls:"BJP", sir:23000},

  {seat:"Bongaon South", region:"Border", margin:14000, ls:"BJP", sir:30000},
  {seat:"Gaighata", region:"Border", margin:10500, ls:"BJP", sir:28000},

  {seat:"Jalpaiguri", region:"North Bengal", margin:12000, ls:"BJP", sir:26000},

  {seat:"Jhargram", region:"Junglemahal", margin:15000, ls:"Close", sir:18000},

  {seat:"Barasat", region:"Urban", margin:13500, ls:"Close", sir:12000},
];

// CALCULATIONS
seats.forEach(s => {
  s.ratio = (s.sir / s.margin).toFixed(2);

  if (s.ratio > 1) s.volatility = "HIGH";
  else if (s.ratio >= 0.5) s.volatility = "MEDIUM";
  else s.volatility = "LOW";

  if (s.volatility === "HIGH" && s.ls === "BJP") s.flip = "HIGH";
  else if (s.volatility === "HIGH") s.flip = "MEDIUM";
  else s.flip = "LOW";
});
