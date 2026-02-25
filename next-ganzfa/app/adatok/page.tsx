"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  LogOut,
  User,
  BookOpen,
  Award,
  Target,
  School,
  CheckSquare,
} from "lucide-react"

interface DiakAdat {
  [key: string]: string | number | null | undefined
}

const EN_DASH = "\u2013"

/* ------------------------------------------------------------------ */
/*  Field display name mapping                                         */
/* ------------------------------------------------------------------ */

const SZEMELYES_MEZOK: Record<string, string> = {
  nev: "Név",
  oktatasiazonosito: "OM azonosító",
  anyjaneve: "Anyja neve",
  szuletesidatum: "Születési dátum",
}

const HETEDIKES_MEZOK: Record<string, string> = {
  het_irodalom: "Irodalom",
  het_magyarnyelv: "Magyar nyelv",
  het_matematika: "Matematika",
  het_tortenelem: "Történelem",
  het_idegennyelv: "Idegen nyelv",
  het_fizika: "Fizika",
  het_technika: "Technika",
}

const NYOLCADIKOS_MEZOK: Record<string, string> = {
  nyolc_irodalom: "Irodalom",
  nyolc_magyarnyelv: "Magyar nyelv",
  nyolc_matematika: "Matematika",
  nyolc_tortenelem: "Történelem",
  nyolc_idegennyelv: "Idegen nyelv",
  nyolc_fizika: "Fizika",
  nyolc_technika: "Technika",
}

const PONT_MEZOK: Record<string, string> = {
  magyar_pontok: "Magyar pontok",
  matematika_pontok: "Matematika pontok"
}



/* ------------------------------------------------------------------ */
/*  Képzések (0101-0104)                                               */
/* ------------------------------------------------------------------ */

const KEPZESEK = [
  { kod: "0101", label: "0101" },
  { kod: "0102", label: "0102" },
  { kod: "0103", label: "0103" },
  { kod: "0104", label: "0104" },
] as const

/* ------------------------------------------------------------------ */
/*  Normalize: trim kulcsok + string értékek                           */
/* ------------------------------------------------------------------ */

function normalizeDiak(input: any): DiakAdat {
  if (!input || typeof input !== "object") return {}
  const out: DiakAdat = {}
  for (const [kRaw, vRaw] of Object.entries(input)) {
    const k = typeof kRaw === "string" ? kRaw.trim() : String(kRaw)
    let v: any = vRaw
    if (typeof v === "string") v = v.trim()
    out[k] = v
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDatumIdo(ertek: string | number | null | undefined): string {
  if (ertek === null || ertek === undefined || ertek === "" || ertek === "-") return EN_DASH
  const s = String(ertek)
  const d = new Date(s)
  if (isNaN(d.getTime())) return s
  return d.toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatErtek(kulcs: string, ertek: string | number | null | undefined): string {
  if (ertek === null || ertek === undefined || ertek === "" || ertek === "-") return EN_DASH

  if (kulcs === "szuletesidatum" && typeof ertek === "string") {
    const d = new Date(ertek)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })
    }
    return String(ertek)
  }

  if (kulcs.endsWith("_idopont") || kulcs === "ganz_idopont") {
    return formatDatumIdo(ertek)
  }

  return String(ertek)
}

function isNumericValue(val: string | number | null | undefined): boolean {
  if (val === null || val === undefined || val === "" || val === "-") return false
  return !isNaN(Number(val))
}

function gradeColor(val: string | number | null | undefined): string {
  const n = Number(val)
  if (isNaN(n)) return "bg-muted text-muted-foreground"
  if (n === 5) return "bg-emerald-100 text-emerald-700"
  if (n === 4) return "bg-sky-100 text-sky-700"
  if (n === 3) return "bg-amber-100 text-amber-700"
  if (n === 2) return "bg-orange-100 text-orange-700"
  return "bg-red-100 text-red-700"
}

/* ------------------------------------------------------------------ */
/*  Képzés név / sorrend helper                                        */
/* ------------------------------------------------------------------ */

function kepzesNevFromDiak(diak: DiakAdat, kod: string): string {
  const fields = ["megjelolt_kepzes_1", "megjelolt_kepzes_2", "megjelolt_kepzes_3", "megjelolt_kepzes_4"] as const
  for (const f of fields) {
    const v = diak[f]
    if (typeof v === "string" && v.includes(kod)) return v
  }
  // fallback: ha nincs megjelölt név, próbáljuk a felvett_kepzes-t
  const felvett = diak["felvett_kepzes"]
  if (typeof felvett === "string" && felvett.includes(kod)) return felvett
  return kod
}

function megjelolesSorrend(diak: DiakAdat, kod: string): string {
  const fields = ["megjelolt_kepzes_1", "megjelolt_kepzes_2", "megjelolt_kepzes_3", "megjelolt_kepzes_4"] as const
  for (let i = 0; i < fields.length; i++) {
    const v = diak[fields[i]]
    if (typeof v === "string" && v.includes(kod)) return String(i + 1)
  }
  return "-"
}

function elozetesHelyezes(diak: DiakAdat, kod: string): string {
  const pairs = [
    ["rangsor_kepzes_1", "rangsor_helyezes_1"],
    ["rangsor_kepzes_2", "rangsor_helyezes_2"],
    ["rangsor_kepzes_3", "rangsor_helyezes_3"],
    ["rangsor_kepzes_4", "rangsor_helyezes_4"],
  ] as const

  for (const [kKey, hKey] of pairs) {
    const k = diak[kKey]
    const h = diak[hKey]
    if (typeof k === "string" && k.includes(kod) && h !== null && h !== undefined && h !== "") {
      return String(h)
    }
  }
  return "-"
}

/* ------------------------------------------------------------------ */
/*  Felvett-e helper: a trigger miatt ez a legbiztosabb                 */
/* ------------------------------------------------------------------ */

function felvettekE(diak: DiakAdat): { felvettek: boolean; kod: string } {
  // 1) ha felvett_hova_kod megvan, az a legjobb
  const kodRaw = String(diak.felvett_hova_kod ?? "").trim()
  if (kodRaw) return { felvettek: true, kod: kodRaw }

  // 2) különben a boolean mezők alapján eldöntjük
  const b0101 = Number(diak.felvett_0101 ?? 0) === 1
  const b0102 = Number(diak.felvett_0102 ?? 0) === 1
  const b0103 = Number(diak.felvett_0103 ?? 0) === 1
  const b0104 = Number(diak.felvett_0104 ?? 0) === 1

  if (b0101) return { felvettek: true, kod: "0101" }
  if (b0102) return { felvettek: true, kod: "0102" }
  if (b0103) return { felvettek: true, kod: "0103" }
  if (b0104) return { felvettek: true, kod: "0104" }

  return { felvettek: false, kod: "" }
}

/* ------------------------------------------------------------------ */
/*  Reusable summary row                                               */
/* ------------------------------------------------------------------ */

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border bg-primary/5 px-5 py-3.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-base font-bold text-primary">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section card component                                             */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  icon: Icon,
  fields,
  diak,
  isGrade,
  summaryLabel,
  summaryKey,
}: {
  title: string
  icon: React.ElementType
  fields: Record<string, string>
  diak: DiakAdat
  isGrade?: boolean
  summaryLabel?: string
  summaryKey?: string
}) {
  const entries = Object.entries(fields).filter(([kulcs]) => diak[kulcs] !== undefined)
  const hasSummary = summaryKey && diak[summaryKey] !== undefined
  if (entries.length === 0 && !hasSummary) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-3.5">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      </div>

      <div className="divide-y divide-border">
        {entries.map(([kulcs, nev]) => {
          const ertek = diak[kulcs]
          const formatted = formatErtek(kulcs, ertek)

          const isXField = kulcs.startsWith("jelolt_")
          const isFelvettField = kulcs.startsWith("felvett_") && kulcs !== "felvett_kepzes"
          const showAsBadge = isGrade || isXField || isFelvettField

          return (
            <div key={kulcs} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-sm text-muted-foreground">{nev}</span>

              {showAsBadge && formatted !== EN_DASH ? (
                <span
                  className={`inline-flex min-w-[2rem] items-center justify-center rounded-lg px-2.5 py-1 text-sm font-semibold ${
                    isGrade ? gradeColor(ertek) : "bg-primary/10 text-primary"
                  }`}
                >
                  {formatted}
                </span>
              ) : (
                <span className="text-right text-sm font-medium text-card-foreground">{formatted}</span>
              )}
            </div>
          )
        })}
      </div>

      {hasSummary && summaryLabel && (
        <SummaryRow label={summaryLabel} value={formatErtek(summaryKey!, diak[summaryKey!])} />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Iskolai pontok kártya                                              */
/* ------------------------------------------------------------------ */

function IskolaiPontokCard({ diak }: { diak: DiakAdat }) {
  const nyelviPont = diak.nyelvi_szintfelmeres
  const nyelviIdopont = diak.nyelvi_szintfelmeres_idopont
  const ganzPont = diak.ganziskola_ismerkedesi_pontok
  const ganzIdopont = diak.ganz_idopont

  const osszes: string = (() => {
    const n1 = isNumericValue(nyelviPont) ? Number(nyelviPont) : null
    const n2 = isNumericValue(ganzPont) ? Number(ganzPont) : null
    if (n1 !== null && n2 !== null) return String(n1 + n2)
    if (n1 !== null) return String(n1)
    if (n2 !== null) return String(n2)
    return EN_DASH
  })()

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-3.5">
        <School className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Ganz Iskola felvételi pontszámok
        </h2>
      </div>

      <div className="divide-y divide-border">
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm text-muted-foreground">Nyelvi szintfelmérő (pont)</span>
          <span className="text-right text-sm font-medium text-card-foreground">
            {formatErtek("nyelvi_szintfelmeres", nyelviPont)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm text-muted-foreground">Nyelvi szintfelmérő időpont</span>
          <span className="text-right text-sm font-medium text-card-foreground">
            {formatErtek("nyelvi_szintfelmeres_idopont", nyelviIdopont)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm text-muted-foreground">Ismerkedés a Ganz Iskolával (pont)</span>
          <span className="text-right text-sm font-medium text-card-foreground">
            {formatErtek("ganziskola_ismerkedesi_pontok", ganzPont)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm text-muted-foreground">Ganz időpont</span>
          <span className="text-right text-sm font-medium text-card-foreground">
            {formatErtek("ganz_idopont", ganzIdopont)}
          </span>
        </div>
      </div>

      <SummaryRow label="Összesen" value={osszes} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Felvételi rangsor card                                             */
/* ------------------------------------------------------------------ */

function FelveteliRangsorCard({ diak }: { diak: DiakAdat }) {
  const { felvettek, kod } = felvettekE(diak)

  const veglegesSzoveg = felvettek
    ? "Felvételt nyert"
    : "Egyik képzésünkre sem nyert felvételt"

  const veglegesKepzesSor = felvettek
    ? `${kod} – ${kepzesNevFromDiak(diak, kod)}`
    : EN_DASH

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-3.5">
        <Target className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Felvételi rangsor
        </h2>
      </div>

      <div className="p-5 space-y-6">
        {/* 1) Megjelölt képzések */}
        <div>
          <div className="mb-3 text-sm font-semibold text-foreground">Megjelölt képzések</div>

          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground">
            <div className="col-span-2">Sorszám</div>
            <div className="col-span-2">Kód</div>
            <div className="col-span-8">Képzés</div>
          </div>

          <div className="mt-2 divide-y divide-border rounded-xl border border-border">
            {KEPZESEK.map((k) => (
              <div key={k.kod} className="grid grid-cols-12 gap-2 px-3 py-2 text-sm">
                <div className="col-span-2 font-semibold text-primary">{megjelolesSorrend(diak, k.kod)}</div>
                <div className="col-span-2 text-muted-foreground">{k.kod}</div>
                <div className="col-span-8 text-card-foreground">{kepzesNevFromDiak(diak, k.kod)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2) Előzetes rangsor */}
        <div>
          <div className="mb-3 text-sm font-semibold text-foreground">Előzetes rangsor</div>

          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground">
            <div className="col-span-2">Helyezés</div>
            <div className="col-span-2">Kód</div>
            <div className="col-span-8">Képzés</div>
          </div>

          <div className="mt-2 divide-y divide-border rounded-xl border border-border">
            {KEPZESEK.map((k) => (
              <div key={k.kod} className="grid grid-cols-12 gap-2 px-3 py-2 text-sm">
                <div className="col-span-2 font-semibold text-primary">{elozetesHelyezes(diak, k.kod)}</div>
                <div className="col-span-2 text-muted-foreground">{k.kod}</div>
                <div className="col-span-8 text-card-foreground">{kepzesNevFromDiak(diak, k.kod)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3) Végleges rangsor */}
        <div>
          <div className="mb-3 text-sm font-semibold text-foreground">Végleges rangsor</div>

          <div className="divide-y divide-border rounded-xl border border-border">
            <div className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="text-muted-foreground">Eredmény</span>
              <span className="font-semibold text-card-foreground">{veglegesSzoveg}</span>
            </div>

            <div className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="text-muted-foreground">Felvett képzés</span>
              <span className="font-semibold text-card-foreground">{veglegesKepzesSor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Highlight stat card                                                */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-5 ${
        accent ? "border-primary/20 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <span className={`text-2xl font-bold ${accent ? "text-primary" : "text-card-foreground"}`}>
        {value}
      </span>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function Adatok() {
  const [diak, setDiak] = useState<DiakAdat | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("diak")
    if (!stored) {
      router.push("/")
      return
    }
    try {
      setDiak(normalizeDiak(JSON.parse(stored)))
    } catch {
      router.push("/")
    }
  }, [router]) // FIX: mindig ugyanaz a dependency array

  const kijelentkezes = () => {
    localStorage.removeItem("diak")
    router.push("/")
  }

  if (!diak) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-card-foreground">GANZ Felvételi Pont</span>
          </div>
          <button
            onClick={kijelentkezes}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <LogOut className="h-4 w-4" />
            Kijelentkezés
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {diak.nev ? String(diak.nev).charAt(0).toUpperCase() : "D"}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {String(diak.nev || "Diák")}
            </h1>
            <p className="text-sm text-muted-foreground">Személyes adatok áttekintése</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Összes pont" value={String(diak.osszespont ?? "Hamarosan")} accent />
          <StatCard
            label="Ganz pont"
            value={String(diak.ganziskola_ismerkedesi_pontok ?? "Hamarosan")}
          />
          <StatCard label="Felvételi státusz" value={String(diak.felveteli_statusz ?? "Hamarosan")} />
        </div>

        <div className="flex flex-col gap-6">
          <SectionCard title="Személyes adatok" icon={User} fields={SZEMELYES_MEZOK} diak={diak} />
          <SectionCard title="7. osztályos jegyek" icon={BookOpen} fields={HETEDIKES_MEZOK} diak={diak} isGrade />
          <SectionCard title="8. osztályos jegyek" icon={BookOpen} fields={NYOLCADIKOS_MEZOK} diak={diak} isGrade />
          <SectionCard
            title="Központi felvételi pontszámok"
            icon={Award}
            fields={PONT_MEZOK}
            diak={diak}
            summaryLabel="Központi felvételi pontok összesen"
            summaryKey="kozponti_pontok"
          />
          <IskolaiPontokCard diak={diak} />
          <FelveteliRangsorCard diak={diak} />
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          GANZ Iskola {EN_DASH} Minden jog fenntartva
        </p>
      </main>
    </div>
  )
}