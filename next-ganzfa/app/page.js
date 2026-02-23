"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [oktatasiAzonosito, setOktatasiAzonosito] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [hiba, setHiba] = useState("");

  const belepes = async () => {
    setHiba("");

    const res = await fetch("https://ganzfa-production.up.railway.app/api/belepes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oktatasiAzonosito, jelszo })
    });

    if (res.ok) {
      const adat = await res.json();
      localStorage.setItem("diak", JSON.stringify(adat));
      router.push("/adatok");
    } else {
      setHiba("Hibás azonosító vagy jelszó");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Belépés</h2>

        <input
          placeholder="OM azonosító"
          value={oktatasiAzonosito}
          onChange={(e) => setOktatasiAzonosito(e.target.value)}
        />

        <input
          type="password"
          placeholder="Jelszó"
          value={jelszo}
          onChange={(e) => setJelszo(e.target.value)}
        />

        <button onClick={belepes}>Belépés</button>

        {hiba && <p style={{ color: "red" }}>{hiba}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f766e"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px"
  }
};