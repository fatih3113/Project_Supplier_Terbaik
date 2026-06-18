import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAssessments = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const targetDate = date ? String(date) : new Date().toISOString().split('T')[0];

    // 1. Ambil data kriteria untuk mengetahui jenis kriteria (benefit/cost) & bobotnya
    const criteria = await prisma.criteria.findMany();

    // 2. Ambil data penilaian (assessment) yang sesuai dengan tanggal filter
    const assessments = await prisma.assessment.findMany({
      where: {
        createdAt: {
          gte: new Date(`${targetDate}T00:00:00.000Z`),
          lte: new Date(`${targetDate}T23:59:59.999Z`),
        },
      },
      include: {
        supplier: true,
        criteria: true,
      },
    });

    if (assessments.length === 0 || criteria.length === 0) {
      return res.json([]);
    }

    // 3. Hitung Nilai Max/Min per Kriteria dari seluruh data penilaian yang aktif saat ini
    const extremeValues: { [key: number]: { max: number; min: number } } = {};
    criteria.forEach((c) => {
      extremeValues[c.id] = { max: -Infinity, min: Infinity };
    });

    assessments.forEach((a) => {
      if (extremeValues[a.criteriaId]) {
        if (a.nilai > extremeValues[a.criteriaId].max) extremeValues[a.criteriaId].max = a.nilai;
        if (a.nilai < extremeValues[a.criteriaId].min) extremeValues[a.criteriaId].min = a.nilai;
      }
    });

    // 4. Petakan data agar menyertakan Nilai Normal dan Nilai Terbobot secara real-time
    const responseData = assessments.map((a) => {
      const crit = a.criteria;
      const nilaiAsli = a.nilai;
      let nilaiNormal = 0;

      const currentMax = extremeValues[a.criteriaId]?.max === -Infinity ? 1 : (extremeValues[a.criteriaId]?.max || 1);
      const currentMin = extremeValues[a.criteriaId]?.min === Infinity ? 0 : (extremeValues[a.criteriaId]?.min || 0);

      // Rumus Normalisasi SAW
      if (crit.jenis.toLowerCase() === 'benefit') {
        nilaiNormal = currentMax !== 0 ? nilaiAsli / currentMax : 0;
      } else {
        nilaiNormal = nilaiAsli !== 0 ? currentMin / nilaiAsli : 0;
      }

      // Hitung Nilai Terbobot
      const nilaiTerbobot = nilaiNormal * crit.bobot;

      return {
        id: a.id,
        supplierId: a.supplierId,
        criteriaId: a.criteriaId,
        nilai: nilaiAsli, // Nilai asli
        nilai_normal: Number(nilaiNormal.toFixed(4)), // Untuk kolom Nilai Normal
        nilai_terbobot: Number(nilaiTerbobot.toFixed(4)), // Untuk kolom Nilai Terbobot
        supplier: a.supplier,
        criteria: crit,
      };
    });

    res.json(responseData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi create, update, delete tetap biarkan sama seperti bawaanmu...
export const createAssessment = async (req: Request, res: Response) => {
  try {
    const { supplierId, criteriaId, nilai } = req.body;
    const upserted = await prisma.assessment.upsert({
      where: {
        supplierId_criteriaId: { supplierId: Number(supplierId), criteriaId: Number(criteriaId) }
      },
      update: { nilai: Number(nilai) },
      create: { supplierId: Number(supplierId), criteriaId: Number(criteriaId), nilai: Number(nilai) }
    });
    res.status(201).json(upserted);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nilai } = req.body;
    const updated = await prisma.assessment.update({
      where: { id: Number(id) },
      data: { nilai: Number(nilai) }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.assessment.delete({ where: { id: Number(id) } });
    res.json({ message: 'Penilaian dihapus' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};