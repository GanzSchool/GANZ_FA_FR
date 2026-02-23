"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, LogOut, User, BookOpen, Award, Target } from "lucide-react"

interface DiakAdat {
  [key: string]: string | number | null | undefined
}

/* ------------------------------------------------------------------ */
/*  Field display name mapping                                         */
/* ------------------------------------------------------------------ */

const SZEMELYES_MEZOK: Record<string, string> = {
  nev: "Nev",
  oktatasiazonosito: "OM azonosito",
  anyjaneve: "Anyja neve",
  szuletesidatum: "Szuletesi datum",
}

const HETEDIKES_MEZOK: Record<string, string> = {
  het_irodalom: "Irodalom",
  het_magyarnyelv: "Magyar nyelv",
  het_matematika: "Matematika",
  het_tortenelem: "Tortenelem",
  het_idegennyelv: "Idegen nyelv",
  het_fizika: "Fizika",
  het_technika: "Technika",
}

const NYOLCADIKOS_MEZOK: Record<string, string> = {
  nyolc_irodalom: "Irodalom",
  nyolc_magyarnyelv: "Magyar nyelv",
  nyolc_matematika: "Matematika",
  nyolc_tortenelem: "Tortenelem",
  nyolc_idegennyelv: "Idegen nyelv",
  nyolc_fizika: "Fizika",
  nyolc_technika: "Technika",
}

const PONT_MEZOK: Record<string, string> = {
  kozponti_pontok: "Kozponti pontok",
  magyar_pontok: "Magyar pontok",
  matematika_pontok: "Matematika pontok",
  nyelvi_szintfelmeres: "Nyelvi szintfelmeres",
  ganziskola_ismerkedesi_pontok: "Ismerkedesi pontok",
  osszespont: "Osszes pont",
}

const FELVETELI_MEZOK: Record<string, string> = {
  megjelolt_kepzes_1: "1. megjelolt kepzes",
  megjelolt_kepzes_2: "2. megjelolt kepzes",
  megjelolt_kepzes_3: "3. megjelolt kepzes",
  rangsor_kepzes_1: "1. rangsor kepzes",
  rangsor_helyezes_1: "1. rangsor helyezes",
  rangsor_kepzes_2: "2. rangsor kepzes",
  rangsor_helyezes_2: "2. rangsor helyezes",
  felvett_kepzes: "Felvett kepzes",
}

/* ------------------------------------------------------------------ */
/*  Helper: format values nicely                                       */
/* ------------------------------------------------------------------ */

function formatErtek(kulcs: string, ertek: string | number | null | undefined): string {
  if (ertek === null || ertek === undefined || ertek === "" || ertek === "-")
    return "\u2013"
  if (kulcs === "szuletesidatum" && typeof ertek === "string") {
    try {
      return new Date(ertek).toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return String(ertek)
    }
  }
  return String(ertek)
}

/* ------------------------------------------------------------------ */
/*  Grade badge color                                                  */
/* ------------------------------------------------------------------ */

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
/*  Section card component                                             */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  icon: Icon,
  fields,
  diak,
  isGrade,
}: {
  title: string
  icon: React.ElementType
  fields: Record<string, string>
  diak: DiakAdat
  isGrade?: boolean
}) {
  const entries = Object.entries(fields).filter(
    ([kulcs]) => diak[kulcs] !== undefined
  )
  if (entries.length === 0) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-3.5">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
      </div>
      <div className="divide-y divide-border">
        {entries.map(([kulcs, nev]) => {
          const ertek = diak[kulcs]
          const formatted = formatErtek(kulcs, ertek)
          return (
            <div
              key={kulcs}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <span className="text-sm text-muted-foreground">{nev}</span>
              {isGrade && formatted !== "\u2013" ? (
                <span
                  className={`inline-flex min-w-[2rem] items-center justify-center rounded-lg px-2.5 py-1 text-sm font-semibold ${gradeColor(ertek)}`}
                >
                  {formatted}
                </span>
              ) : (
                <span className="text-right text-sm font-medium text-card-foreground">
                  {formatted}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Highlight stat card                                                */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-5 ${
        accent
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      <span
        className={`text-2xl font-bold ${accent ? "text-primary" : "text-card-foreground"}`}
      >
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
    const adat = localStorage.getItem("diak")
    if (!adat) {
      router.push("/")
    } else {
      setDiak(JSON.parse(adat))
    }
  }, [router])

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
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-card-foreground">
              GANZ FA
            </span>
          </div>
          <button
            onClick={kijelentkezes}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <LogOut className="h-4 w-4" />
            {"Kijelentkezes"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        {/* Profile header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {diak.nev ? String(diak.nev).charAt(0).toUpperCase() : "D"}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {String(diak.nev || "Diak")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {"Szemelyes adatok attekintese"}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        {(diak.osszespont || diak.nyelvi_szintfelmeres || diak.felvett_kepzes) && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {diak.osszespont && (
              <StatCard
                label="Osszes pont"
                value={String(diak.osszespont)}
                accent
              />
            )}
            {diak.nyelvi_szintfelmeres && (
              <StatCard
                label="Nyelvi szintfelmeres"
                value={String(diak.nyelvi_szintfelmeres)}
              />
            )}
            {diak.rangsor_helyezes_1 && (
              <StatCard
                label="Rangsor helyezes"
                value={`${diak.rangsor_helyezes_1}.`}
              />
            )}
          </div>
        )}

        {/* Section cards */}
        <div className="flex flex-col gap-6">
          <SectionCard
            title="Szemelyes adatok"
            icon={User}
            fields={SZEMELYES_MEZOK}
            diak={diak}
          />
          <SectionCard
            title="7. osztalyos jegyek"
            icon={BookOpen}
            fields={HETEDIKES_MEZOK}
            diak={diak}
            isGrade
          />
          <SectionCard
            title="8. osztalyos jegyek"
            icon={BookOpen}
            fields={NYOLCADIKOS_MEZOK}
            diak={diak}
            isGrade
          />
          <SectionCard
            title="Pontszamok"
            icon={Award}
            fields={PONT_MEZOK}
            diak={diak}
          />
          <SectionCard
            title="Felveteli es rangsor"
            icon={Target}
            fields={FELVETELI_MEZOK}
            diak={diak}
          />
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          {"GANZ Iskola \u2013 Minden jog fenntartva"}
        </p>
      </main>
    </div>
  )
}
