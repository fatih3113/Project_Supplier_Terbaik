import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getRanking = async (req: Request, res: Response) => {
  try {
    // megambil parameter peroid berdasarkan bulan dan tahun dari query string, misal: ?period=2023-08
    const { period } = req.query;
    
    let startDate: Date;
    let endDate: Date;

    if (period) {
      const [year, month] = String(period).split('-');
      // Awal bulan (Tanggal 1 jam 00:00:00)
      startDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0));
      // Akhir bulan (Tanggal 0 bulan berikutnya otomatis menunjuk ke hari terakhir bulan ini jam 23:59:59)
      endDate = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999));
    } else {
      // Fallback jika tidak ada param period: ambil 1 bulan penuh berdasarkan bulan saat ini
      const today = new Date();
      startDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0));
      endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999));
    }

    // 2. Ambil semua kriteria
    const criteria = await prisma.criteria.findMany();
    
    // 3. Ambil semua supplier DAN sertakan assessments berdasarkan rentang 1 bulan penuh
    const suppliers = await prisma.supplier.findMany({
      include: {
        assessments: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    if (suppliers.length === 0 || criteria.length === 0) {
      return res.json([]);
    }

    // 4. Inisialisasi Nilai Max/Min per Kriteria untuk Normalisasi
    const extremeValues: { [key: number]: { max: number; min: number } } = {};
    criteria.forEach((c) => {
      extremeValues[c.id] = { max: -Infinity, min: Infinity };
    });

    // 5. Cari nilai max dan min yang sebenarnya dari data yang ada
    suppliers.forEach((s) => {
      s.assessments.forEach((a: any) => {
        if (extremeValues[a.criteriaId]) {
          if (a.nilai > extremeValues[a.criteriaId].max) extremeValues[a.criteriaId].max = a.nilai;
          if (a.nilai < extremeValues[a.criteriaId].min) extremeValues[a.criteriaId].min = a.nilai;
        }
      });
    });

    // 6. Proses Perhitungan Metode Simple Additive Weighting (SAW)
    const rankingResult = suppliers.map((sup) => {
      let totalPreference = 0;

      criteria.forEach((crit) => {
        const assessment = sup.assessments.find((a: any) => a.criteriaId === crit.id);
        const nilai = assessment ? assessment.nilai : 0;
        let normalized = 0;

        const currentMax = extremeValues[crit.id]?.max === -Infinity ? 1 : (extremeValues[crit.id]?.max || 1);
        const currentMin = extremeValues[crit.id]?.min === Infinity ? 0 : (extremeValues[crit.id]?.min || 0);

        if (crit.jenis.toLowerCase() === 'benefit') {
          normalized = currentMax !== 0 ? nilai / currentMax : 0;
        } else {
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