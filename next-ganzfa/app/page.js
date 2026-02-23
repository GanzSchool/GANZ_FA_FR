"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [oktatasiAzonosito, setOktatasiAzonosito] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [hiba, setHiba] = useState("");
  const [betolt, setBetolt] = useState(false);

  const belepes = async () => {
    setHiba("");
    setBetolt(true);

    try {
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
        setHiba("Hibas azonosito vagy jelszo");
      }
    } catch {
      setHiba("Halozati hiba tortent. Probald ujra.");
    } finally {
      setBetolt(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") belepes();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-lg">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-foreground">
            GANZ FA
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/70">
            {"Diak portal - Jelentkezz be az adataid megtekintegesehez"}
          </p>
        </div>

        <div className="rounded-2xl bg-card p-8 shadow-xl shadow-black/10">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            {"Belepes"}
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="om-id"
                className="mb-1.5 block text-sm font-medium text-card-foreground"
              >
                {"OM azonosito"}
              </label>
              <input
                id="om-id"
                type="text"
                placeholder="Add meg az OM azonositod"
                value={oktatasiAzonosito}
                onChange={(e) => setOktatasiAzonosito(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-card-foreground"
              >
                {"Jelszo"}
              </label>
              <input
                id="password"
                type="password"
                placeholder="Add meg a jelszavad"
                value={jelszo}
                onChange={(e) => setJelszo(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {hiba && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {hiba}
              </div>
            )}

            <button
              onClick={belepes}
              disabled={betolt}
              className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {betolt ? "Belepes..." : "Belepes"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-primary-foreground/50">
          {"GANZ Iskola - Minden jog fenntartva"}
        </p>
      </div>
    </div>
  );
}
