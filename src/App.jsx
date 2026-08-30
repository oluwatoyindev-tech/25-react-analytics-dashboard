import React, { useState, useMemo } from "react";

function Line({ values, color = "var(--brand)", height = 180 }) {
  const max = Math.max(...values), min = Math.min(0, ...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 88 - ((v - min) / (max - min || 1)) * 78]);
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height }}>
      <path d={`${path} L 100 90 L 0 90 Z`} fill={color} opacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Bars({ data, height = 180, color = "var(--brand)" }) {
  const max = Math.max(...data.map((d) => d.value));
  const bw = 100 / data.length;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * 82;
        return <rect key={i} x={i * bw + bw * 0.2} y={90 - h} width={bw * 0.6} height={h} rx="1.2" fill={color}><title>{d.label}: {d.value}</title></rect>;
      })}
    </svg>
  );
}

const RANGES = {
  "7d": { visitors: [420, 510, 480, 620, 700, 880, 640], series: [22, 26, 24, 30, 28, 34, 33], rev: 12.4, conv: 3.1 },
  "30d": { visitors: Array.from({ length: 12 }, (_, i) => 400 + Math.round(Math.sin(i) * 120) + i * 20), series: [18, 20, 22, 21, 26, 28, 30, 29, 34, 33, 40, 44], rev: 8.9, conv: 2.8 },
};

export default function App() {
  const [range, setRange] = useState("7d");
  const d = RANGES[range];
  const totalVisitors = useMemo(() => d.visitors.reduce((s, v) => s + v, 0), [d]);

  return (
    <div className="shell">
      <aside className="side">
        <div className="logo">📈 Metric</div>
        <a className="active">Overview</a><a>Audience</a><a>Traffic</a><a>Reports</a>
      </aside>
      <div className="main">
        <div className="flex between items wrapf gap" style={{ marginBottom: 20 }}>
          <div><h1 className="page-title">Analytics</h1><p className="muted">Product performance overview.</p></div>
          <div className="flex gap">
            {Object.keys(RANGES).map((r) => <button key={r} className={"btn sm" + (range === r ? " primary" : "")} onClick={() => setRange(r)}>{r}</button>)}
          </div>
        </div>

        <div className="grid g4" style={{ marginBottom: 20 }}>
          <div className="stat"><div className="k">Visitors</div><div className="v">{totalVisitors.toLocaleString()}</div><div className="d up">▲ {d.rev}%</div></div>
          <div className="stat"><div className="k">Revenue</div><div className="v">${(totalVisitors * 0.9).toFixed(0)}</div></div>
          <div className="stat"><div className="k">Conversion</div><div className="v">{d.conv}%</div></div>
          <div className="stat"><div className="k">Avg. session</div><div className="v">3m 12s</div></div>
        </div>

        <div className="grid g2" style={{ marginBottom: 20 }}>
          <div className="card pad"><h3 style={{ marginBottom: 12 }}>Revenue trend</h3><Line values={d.series} /></div>
          <div className="card pad"><h3 style={{ marginBottom: 12 }}>Visitors</h3><Bars data={d.visitors.map((v, i) => ({ label: i, value: v }))} color="#8b5cf6" /></div>
        </div>

        <div className="card pad">
          <h3 style={{ marginBottom: 10 }}>Top pages</h3>
          <div className="table-wrap"><table>
            <thead><tr><th>Page</th><th>Views</th><th>Bounce</th><th>Avg. time</th></tr></thead>
            <tbody>
              {[["/", 4820, "38%", "2m 40s"], ["/pricing", 2110, "22%", "3m 05s"], ["/blog", 1760, "51%", "1m 20s"], ["/docs", 1290, "18%", "4m 12s"]].map((r) => (
                <tr key={r[0]}><td><b>{r[0]}</b></td><td>{r[1].toLocaleString()}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
    </div>
  );
}
