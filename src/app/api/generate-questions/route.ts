import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { weaknesses, weaknessData, role, qna } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Build a precise failure fingerprint for the prompt
    const highSeverityWeaknesses = (weaknessData || [])
      .filter((w: any) => w.severity === 'High')
      .map((w: any) => w.name)
      .join(', ');

    const failedAnswers = (qna || [])
      .filter((q: any) => (q.score || 0) < 55)
      .slice(0, 5)
      .map((q: any, i: number) => `Q${i + 1}: "${q.q}" — What went wrong: ${q.wrong}`)
      .join('\n');

    const prompt = `You are an expert technical interview coach designing a targeted practice question bank.

This candidate just failed an interview for the role of "${role || 'Software Engineer'}".

## Their Failure Profile:
- Overall weaknesses: ${weaknesses || 'General lack of structure and depth'}
- High-severity gaps: ${highSeverityWeaknesses || 'Structure, confidence, specificity'}
- Specific failed questions and why:
${failedAnswers || 'Vague answers with no metrics or structure'}

## Your Task:
Generate exactly 10 targeted practice questions that directly attack this candidate's specific failure patterns.
Do NOT generate generic interview questions.
Each question must be specifically calibrated to expose and help fix their exact weaknesses.

For each question, provide:
- category: "Technical" or "Behavioral"  
- difficulty: "Easy", "Medium", or "Hard"
- targetedWeakness: which specific weakness this question trains (from their profile above)
- question: the actual interview question
- whyThisQuestion: 1-sentence explanation of what skill this forces the candidate to demonstrate
- answerHint: 2-3 bullet points on exactly what a strong answer MUST contain

Respond ONLY with a raw JSON array. No markdown. No explanation. No code fences.

[
  {
    "category": "Behavioral",
    "difficulty": "Medium",
    "targetedWeakness": "Lack of Specific Examples",
    "question": "...",
    "whyThisQuestion": "...",
    "answerHint": ["...", "...", "..."]
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const outputText = response.text || '[]';
    const firstBracket = outputText.indexOf('[');
    const lastBracket = outputText.lastIndexOf(']');

    if (firstBracket === -1 || lastBracket === -1) {
      throw new Error('Gemini returned malformed JSON');
    }

    const questions = JSON.parse(outputText.slice(firstBracket, lastBracket + 1));
    return NextResponse.json({ questions });

  } catch (err: any) {
    console.error('[Question Bank] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
