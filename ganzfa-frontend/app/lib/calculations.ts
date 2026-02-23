export interface Diak {
  het_magyarnyelv?: string | number;
  nyolc_magyarnyelv?: string | number;
  het_matematika?: string | number;
  nyolc_matematika?: string | number;
  hozott_pontok?: number;
  ganziskola_ismerkedesi_pontok?: number;
}

export function calculateCentralPoints(diak: Diak): number {
  const magyar = (parseInt(String(diak.het_magyarnyelv)) || 0) +
    (parseInt(String(diak.nyolc_magyarnyelv)) || 0);
  const matematika = (parseInt(String(diak.het_matematika)) || 0) +
    (parseInt(String(diak.nyolc_matematika)) || 0);

  return magyar + matematika;
}

export function calculateTotalPoints(diak: Diak): number {
  const kozponti = calculateCentralPoints(diak);
  const hozott = diak.hozott_pontok || 0;
  const ganz = diak.ganziskola_ismerkedesi_pontok || 0;

  return kozponti + hozott + ganz;
}

export function calculateMagyarPoints(diak: Diak): number {
  return (parseInt(String(diak.het_magyarnyelv)) || 0) +
    (parseInt(String(diak.nyolc_magyarnyelv)) || 0);
}

export function calculateMathPoints(diak: Diak): number {
  return (parseInt(String(diak.het_matematika)) || 0) +
    (parseInt(String(diak.nyolc_matematika)) || 0);
}
