"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Adatok() {
  const [diak, setDiak] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const adat = localStorage.getItem("diak");

    if (!adat) {
      router.push("/");
    } else {
      setDiak(JSON.parse(adat));
    }
  }, []);

  if (!diak) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{diak.nev}</h2>

        {Object.entries(diak).map(([kulcs, ertek]) => (
          <div key={kulcs}>
            <strong>{kulcs}:</strong> {String(ertek)}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#f1f5f9",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "600px"
  }
};