"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Loader2, Eye, EyeOff } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [oktatasiAzonosito, setOktatasiAzonosito] = useState("")
  const [jelszo, setJelszo] = useState("")
  const [hiba, setHiba] = useState("")
  const [betolt, setBetolt] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const belepes = async () => {
    setHiba("")
    setBetolt(true)

    try {
      const res = await fetch(
        "https://ganzfa-production.up.railway.app/api/belepes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oktatasiAzonosito, jelszo }),
        }
      )

      if (res.ok) {
        const adat = await res.json()
        localStorage.setItem("diak", JSON.stringify(adat))
        router.push("/adatok")
      } else {
        setHiba("Hibás azonositó vagy jelszó")
      }
    } catch {
      setHiba("Hálózati hiba történt. Próbálja újra.")
    } finally {
      setBetolt(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") belepes()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      {/* Subtle pattern overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo & Branding */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-lg shadow-black/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-foreground">
           GANZ Felvételi Pont
          </h1>
          <p className="mt-1.5 text-sm text-primary-foreground/70">
            {"Felvételi portál \u2013 Jelentkezz be az adataid megtekintéséhez"}
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-card p-7 shadow-xl shadow-black/10">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">
            {"Belépés"}
          </h2>

          <div className="flex flex-col gap-5">
            {/* OM ID Field */}
            <div>
              <label
                htmlFor="om-id"
                className="mb-1.5 block text-sm font-medium text-card-foreground"
              >
                {"OM azonosító"}
              </label>
              <input
                id="om-id"
                type="text"
                inputMode="numeric"
                placeholder="pl. 7211111111"
                value={oktatasiAzonosito}
                onChange={(e) => setOktatasiAzonosito(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-card-foreground"
              >
                {"Születési dátum"}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="text"
                  placeholder="Születési dátum: 2000-01-01"
                  value={jelszo}
                  onChange={(e) => setJelszo(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Error message */}
            {hiba && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                {hiba}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={belepes}
              disabled={betolt || !oktatasiAzonosito || !jelszo}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {betolt ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {"Belepes..."}
                </>
              ) : (
                "Belepes"
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-primary-foreground/40">
          {"GANZ Iskola \u2013 Minden jog fenntartva"}
        </p>
      </div>
    </div>
  )
}
