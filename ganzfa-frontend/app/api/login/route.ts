'use server';

import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// --- ENV fallback (Railway: MYSQLHOST/MYSQLPORT... vs saját: MYSQL_HOST/MYSQL_PORT...) ---
const host = process.env.MYSQL_HOST || process.env.MYSQLHOST;
const port = Number(process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306);
const user = process.env.MYSQL_USER || process.env.MYSQLUSER;
const password = process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD;
const database = process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE;

// --- pool ---
const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function calculatePoints(diak: any) {
  // Központi felvételi: Magyar + Matematika (7. + 8.)
  const magyar =
    (parseInt(diak.het_magyarnyelv, 10) || 0) +
    (parseInt(diak.nyolc_magyarnyelv, 10) || 0);

  const matematika =
    (parseInt(diak.het_matematika, 10) || 0) +
    (parseInt(diak.nyolc_matematika, 10) || 0);

  const kozponti_pontok = magyar + matematika;

  // Összes pont: Központi + Hozott + GANZ ismerk.
  const hozott = Number(diak.hozott_pontok) || 0;
  const ganz = Number(diak.ganziskola_ismerkedesi_pontok) || 0;
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
    // TEMP DIAG (maradhat, amíg be nem áll a DB; utána nyugodtan töröld)
    console.log('DB CONF:', {
      host: host ? '[OK]' : '[MISSING]',
      port,
      user: user ? '[OK]' : '[MISSING]',
      database: database ? '[OK]' : '[MISSING]',
    });

    const body = await req.json().catch(() => null);

    const oktatasiazonosito = body?.oktatasiazonosito;
    const szuletesidatum = body?.szuletesidatum;

    if (!oktatasiazonosito || !szuletesidatum) {
      return NextResponse.json({ error: 'Hiányzó adatok' }, { status: 400 });
    }

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM diakok WHERE oktatasiazonosito = ? AND szuletesidatum = ?',
        [oktatasiazonosito, szuletesidatum]
      );

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
    } finally {
      conn.release();
    }
  } catch (error: any) {
    // MySQL hiba kinyerése (Railway logban hasznos)
    console.error('Login hiba:', {
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      syscall: error?.syscall,
      address: error?.address,
      port: error?.port,
    });

    return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
  }
}