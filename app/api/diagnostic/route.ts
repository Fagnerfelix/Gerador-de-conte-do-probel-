import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runSleepDiagnosis, type DiagnosisInput } from '@/lib/diagnostic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: DiagnosisInput = {
      sleepPosition: body.sleepPosition,
      firmnessChoice: body.firmnessChoice,
      usage: body.usage,
      sleepsWithPartner: Boolean(body.sleepsWithPartner),
      heatSensitivity: body.heatSensitivity,
      painComplaint: body.painComplaint || '',
    };

    if (!input.sleepPosition || !input.firmnessChoice || !input.usage || !input.heatSensitivity) {
      return NextResponse.json({ error: 'Preencha os campos essenciais do diagnóstico.' }, { status: 400 });
    }

    const result = runSleepDiagnosis(input);

    try {
      await prisma.sleepDiagnosis.create({
        data: {
          customerName: body.customerName || null,
          ...input,
          painComplaint: input.painComplaint || null,
          recommendation: result.recommendation,
          rationale: result.rationale,
        },
      });
    } catch (databaseError) {
      console.error('Diagnosis persistence failed:', databaseError);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível concluir o diagnóstico.' }, { status: 500 });
  }
}
