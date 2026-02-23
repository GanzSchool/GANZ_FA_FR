export interface Diak {
  id: number;
  nev: string;
  oktatasiazonosito: string;
  anyjaneve: string;
  szuletesidatum: string;
  jelszo: string;

  // 7. osztály
  het_irodalom: string;
  het_magyarnyelv: string;
  het_matematika: string;
  het_tortenelem: string;
  het_idegennyelv: string;
  het_fizika: string;
  het_technika: string;

  // 8. osztály
  nyolc_irodalom: string;
  nyolc_magyarnyelv: string;
  nyolc_matematika: string;
  nyolc_tortenelem: string;
  nyolc_idegennyelv: string;
  nyolc_fizika: string;
  nyolc_technika: string;

  // Pontok
  kozponti_pontok: number;
  magyar_pontok: number;
  matematika_pontok: number;
  nyelvi_szintfelmeres: string;
  ganziskola_ismerkedesi_pontok: number;
  osszespont: number;
  hozott_pontok: number;

  // Képzések
  megjelolt_kepzes_1?: string;
  megjelolt_kepzes_2?: string;
  megjelolt_kepzes_3?: string;
  megjelolt_kepzes_4?: string;

  // Rangsor
  rangsor_kepzes_1?: string;
  rangsor_helyezes_1?: number;
  rangsor_kepzes_2?: string;
  rangsor_helyezes_2?: number;

  // Eredmény
  felvett_kepzes?: string;
  nem_felvett_kepzes?: string;

  letrehozva: string;
  modositva: string;
}

export interface LoginRequest {
  oktatasiazonosito: string;
  szuletesidatum: string;
}

export interface LoginResponse {
  success: boolean;
  diak: Diak;
}
