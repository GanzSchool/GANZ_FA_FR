'use server';

import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function calculatePoints(diak: any) {
  // Központi felvételi: Magyar + Matematika (7. + 8.)
  const magyar = (parseInt(diak.het_magyarnyelv) || 0) +
    (parseInt(diak.nyolc_magyarnyelv) || 0);
  const matematika = (parseInt(diak.het_matematika) || 0) +
    (parseInt(diak.nyolc_matematika) || 0);

  const kozponti_pontok = magyar + matematika;

  // Összes pont: Központi + Hozott + GANZ ismerkd.
  const hozott = diak.hozott_pontok || 0;
  const ganz = diak.ganziskola_ismerkedesi_pontok || 0;
  const osszespont = kozponti_pontok + hozott + ganz;

  return {
    kozponti_pontok,
    magyar_pontok: magyar,
    matematika_pontok: matematika,
    osszespont,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { oktatasiazonosito, szuletesidatum } = await req.json();

    if (!oktatasiazonosito || !szuletesidatum) {
      return NextResponse.json(
        { error: 'Hiányzó adatok' },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      'SELECT * FROM diakok WHERE oktatasiazonosito = ? AND szuletesidatum = ?',
      [oktatasiazonosito, szuletesidatum]
    );
    conn.release();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'Hibás oktatási azonosító vagy születési dátum' },
        { status: 401 }
      );
    }

    const diak = rows[0] as any;

    // Pontok kiszámítása
    const pontok = calculatePoints(diak);

    return NextResponse.json({
      success: true,
      diak: {
        ...diak,
        ...pontok,
      },
    });
  } catch (error) {
    console.error('Login hiba:', error);
    return NextResponse.json(
      { error: 'Szerver hiba' },
      { status: 500 }
    );
  }
}
