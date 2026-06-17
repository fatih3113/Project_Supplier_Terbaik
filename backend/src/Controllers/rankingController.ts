import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getRanking = async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({ include: { assessments: true } });
    const criteria = await prisma.criteria.findMany();

    if (suppliers.length === 0 || criteria.length === 0) {
      return res.json([]);
    }

    // Hitung Nilai Max/Min per Kriteria untuk Normalisasi
    const extremeValues: { [key: number]: { max: number; min: number } } = {};
    criteria.forEach((c) => {
      extremeValues[c.id] = { max: -Infinity, min: Infinity };
    });

    suppliers.forEach((s) => {
      s.assessments.forEach((a) => {
        if (extremeValues[a.criteriaId]) {
          if (a.nilai > extremeValues[a.criteriaId].max) extremeValues[a.criteriaId].max = a.nilai;
          if (a.nilai < extremeValues[a.criteriaId].min) extremeValues[a.criteriaId].min = a.nilai;
        }
      });
    });

    // Proses Perhitungan Metode Simple Additive Weighting (SAW)
    const rankingResult = suppliers.map((sup) => {
      let totalPreference = 0;

      criteria.forEach((crit) => {
        const assessment = sup.assessments.find((a) => a.criteriaId === crit.id);
        const nilai = assessment ? assessment.nilai : 0;
        let normalized = 0;

        if (crit.jenis.toLowerCase() === 'benefit') {
          const max = extremeValues[crit.id]?.max || 1;
          normalized = max !== 0 ? nilai / max : 0;
        } else {
          const min = extremeValues[crit.id]?.min || 0;
          normalized = nilai !== 0 ? min / nilai : 0;
        }

        totalPreference += normalized * crit.bobot;
      });

      return {
        id_supplier: sup.id_supplier,
        nama_supplier: sup.nama_supplier,
        nilai: Number(totalPreference.toFixed(3))
      };
    });

    // Urutkan berdasarkan nilai preferensi tertinggi
    rankingResult.sort((a, b) => b.nilai - a.nilai);

    const mappedRanking = rankingResult.map((item, index) => ({
      ...item,
      ranking: index + 1
    }));

    res.json(mappedRanking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};