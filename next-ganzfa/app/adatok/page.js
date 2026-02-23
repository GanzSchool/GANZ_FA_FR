"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const mezoNevek = {
  nev: "Nev",
  oktatasiAzonosito: "OM azonosito",
  osztaly: "Osztaly",
  szuletesiDatum: "Szuletesi datum",
  szuletesiHely: "Szuletesi hely",
  anyjaNeveElotaggal: "Anyja neve",
  lakcim: "Lakcim",
  telefonszam: "Telefonszam",
  email: "Email",
  alpitoiDonto: "Alapitoi donto",
};

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
  }, [router]);

  const kijelentkezes = () => {
    localStorage.removeItem("diak");
    router.push("/");
  };

  if (!diak) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <svg
                className="h-5 w-5 text-primary-foreground"
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
            <span className="text-lg font-bold text-card-foreground">GANZ FA</span>
          </div>
          <button
            onClick={kijelentkezes}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            {"Kijelentkezes"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              {diak.nev ? diak.nev.charAt(0).toUpperCase() : "D"}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {diak.nev || "Diak"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {"Szemelyes adatok attekintese"}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/50 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {"Diak adatok"}
            </h2>
          </div>
          <div className="divide-y divide-border">
            {Object.entries(diak).map(([kulcs, ertek]) => {
              const mezoNev = mezoNevek[kulcs] || kulcs;
              return (
                <div
                  key={kulcs}
                  className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-0"
                >
                  <span className="min-w-[180px] text-sm font-medium text-muted-foreground">
                    {mezoNev}
                  </span>
                  <span className="text-sm text-card-foreground">
                    {String(ertek)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {"GANZ Iskola - Minden jog fenntartva"}
        </p>
      </main>
    </div>
  );
}
