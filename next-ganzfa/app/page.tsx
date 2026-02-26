"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Loader2, CalendarIcon } from "lucide-react"
import { format, parse } from "date-fns"
import { hu } from "date-fns/locale"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function Home() {
  const router = useRouter()
  const [oktatasiAzonosito, setOktatasiAzonosito] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [hiba, setHiba] = useState("")
  const [betolt, setBetolt] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Format date to YYYY-MM-DD for the API
  const jelszo = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""

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
        setHiba("Hibás OM azonosító vagy születési dátum")
        setHiba("Probléma esetén kérjük, írjon az alábbi e-mail címre: info@ganzportalok.hu")
      }
    } catch {
      setHiba("Hálózati hiba történt. Próbálja újra.")
    } finally {
      setBetolt(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      {/* Subtle pattern overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 w-full max-w-md">
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
            {/* OM ID Field - OTP Style */}
            <div>
              <label
                className="mb-2 block text-sm font-medium text-card-foreground"
              >
                {"OM azonosító"}
              </label>
              <div className="rounded-xl border border-border bg-muted/40 px-3 py-3.5">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={11}
                    value={oktatasiAzonosito}
                    onChange={(value) => setOktatasiAzonosito(value)}
                    containerClassName="flex items-center gap-0 has-disabled:opacity-50"
                  >
                    <InputOTPGroup className="flex gap-1.5">
                      {Array.from({ length: 11 }, (_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="!h-9 !w-7 rounded-lg border border-border bg-card text-xs font-bold text-card-foreground shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 first:border first:rounded-lg last:border last:rounded-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="mt-2.5 text-center text-[11px] text-muted-foreground/70">
                </p>
              </div>
            </div>

            {/* Date Picker Field */}
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-card-foreground"
              >
                {"Születési dátum"}
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      selectedDate ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {selectedDate
                      ? format(selectedDate, "yyyy-MM-dd")
                      : "Válaszd ki a születési dátumod"}
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setCalendarOpen(false)
                    }}
                    locale={hu}
                    captionLayout="dropdown"
                    fromYear={1990}
                    toYear={2015}
                    defaultMonth={selectedDate || new Date(2008, 0)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1990-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
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
              disabled={betolt || oktatasiAzonosito.length !== 11 || !selectedDate}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {betolt ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {"Belépés..."}
                </>
              ) : (
                "Belépés"
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
