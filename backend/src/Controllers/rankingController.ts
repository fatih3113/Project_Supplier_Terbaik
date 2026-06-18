import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getRanking = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const targetDate = date ? String(date) : new Date().toISOString().split('T')[0];

    // 1. Ambil semua kriteria
    const criteria = await prisma.criteria.findMany();
    
    // 2. Ambil semua supplier DAN sertakan assessments berdasarkan tanggal
    const suppliers = await prisma.supplier.findMany({
      include: {
        assessments: {
          where: {
            createdAt: {
              gte: new Date(`${targetDate}T00:00:00.000Z`),
              lte: new Date(`${targetDate}T23:59:59.999Z`),
            },
          },
        },
      },
    });

    if (suppliers.length === 0 || criteria.length === 0) {
      return res.json([]);
    }

    // 3. Inisialisasi Nilai Max/Min per Kriteria untuk Normalisasi
    const extremeValues: { [key: number]: { max: number; min: number } } = {};
    criteria.forEach((c) => {
      extremeValues[c.id] = { max: -Infinity, min: Infinity };
    });

    // 4. Cari nilai max dan min yang sebenarnya dari data yang ada
    suppliers.forEach((s) => {
      s.assessments.forEach((a: any) => {
        if (extremeValues[a.criteriaId]) {
          if (a.nilai > extremeValues[a.criteriaId].max) extremeValues[a.criteriaId].max = a.nilai;
          if (a.nilai < extremeValues[a.criteriaId].min) extremeValues[a.criteriaId].min = a.nilai;
        }
      });
    });

    // 5. Proses Perhitungan Metode Simple Additive Weighting (SAW)
    const rankingResult = suppliers.map((sup) => {
      let totalPreference = 0;

      criteria.forEach((crit) => {
        const assessment = sup.assessments.find((a: any) => a.criteriaId === crit.id);
        const nilai = assessment ? assessment.nilai : 0;
        let normalized = 0;

        // Ambil nilai max/min, jika tidak ditemukan/invalid default ke 1 agar tidak bagi dengan 0
        const currentMax = extremeValues[crit.id]?.max === -Infinity ? 1 : (extremeValues[crit.id]?.max || 1);
        const currentMin = extremeValues[crit.id]?.min === Infinity ? 0 : (extremeValues[crit.id]?.min || 0);

        if (crit.jenis.toLowerCase() === 'benefit') {
          normalized = currentMax !== 0 ? nilai / currentMax : 0;
        } else {
          // Jika cost: min / nilai
          normalized = nilai !== 0 ? currentMin / nilai : 0;
        }

        totalPreference += normalized * crit.bobot;
      });

      return {
        id: sup.id_supplier,
        id_supplier: sup.id_supplier,
        supplier_id: sup.id_supplier,
        nama_supplier: sup.nama_supplier,
        supplier_name: sup.nama_supplier,
        nilai: Number(totalPreference.toFixed(4)),
        total_score: Number(totalPreference.toFixed(4)),
      };
    });

    // Urutkan berdasarkan nilai preferensi tertinggi
    rankingResult.sort((a, b) => b.nilai - a.nilai);

    const mappedRanking = rankingResult.map((item, index) => ({
      ...item,
      ranking: index + 1,
      rank: index + 1,
    }));

    res.json(mappedRanking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRankings = getRanking;