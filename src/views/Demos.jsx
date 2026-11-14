"use client";

import Link from "next/link";
import { getAllDemos } from "@/demos"; // ⭐ Import Registry

export default function Demos() {
  const demos = getAllDemos();

  return (
    <div style={{ padding: "5rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center"
        }}
      >
        <h1>Demos</h1>
        <p className="muted" style={{ marginTop: "0px", marginBottom: "30px" }}>
          Pick a demo to open its details. Then open the Owner CRM for that
          demo.
        </p>
      </div>
      <div className="grid">
        {demos.map((d) => (
          <Link
            key={d.id}
            href={`/demos/${d.id}`}
            className="card stat"
            style={{ textDecoration: "none" }}
          >
            <span className="stat-num">{d.name.split("—")[0].trim()}</span>
            <span className="stat-label">{d.description}</span>
            {d.status === 'paused' && (
               <span className="pill off" style={{ marginTop: 8 }}>Paused</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}