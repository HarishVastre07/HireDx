import { analyzeInterviewRecording } from '@/lib/ai/gemini';
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Extend API route timeout to 5 minutes to handle large video processing
export const maxDuration = 300;

// Force dynamic rendering (required when using cookies())
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let tmpFilePath = '';
  let fileObj: File | null = null;
  let roleStr = 'Software Engineer';
  
  try {
    const formData = await req.formData();
    fileObj = formData.get('file') as File | null;
    roleStr = formData.get('role') as string;

    if (!fileObj || !roleStr) {
      return NextResponse.json({ error: 'Missing file or role' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('dummy')) {
      throw new Error("Missing Key");
    }

    const buffer = await fileObj.arrayBuffer();
    const tmpDir = os.tmpdir();
    tmpFilePath = path.join(tmpDir, `upload_${Date.now()}_${fileObj.name}`);
    await fs.writeFile(tmpFilePath, Buffer.from(buffer));
    
    // Attempt Process with Gemini — retry up to 2 times on malformed JSON
    let result: any = null;
    let lastError: any = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini] Attempt ${attempt}...`);
        result = await analyzeInterviewRecording(tmpFilePath, fileObj.type, roleStr);
        break; // success — exit retry loop
      } catch (err: any) {
        lastError = err;
        const isJsonError = err.message?.includes('malformed JSON') || err.message?.includes('valid JSON');
        if (!isJsonError || attempt === 2) throw err; // non-JSON error or exhausted retries
        console.warn(`[Gemini] Attempt ${attempt} failed with JSON error, retrying...`);
      }
    }
    
    await fs.unlink(tmpFilePath).catch(()=>{});

    // --------- START DB INJECTION ---------
    let databaseId: string | null = null;
    try {
      const cookieStore = await cookies();
      console.log("[DB] Building Supabase server client...");

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) { return cookieStore.get(name)?.value; },
            set() {},
            remove() {},
          },
        }
      );

      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      console.log("[DB] Auth result:", user ? `user=${user.id}` : "no user", authErr ? `err=${authErr.message}` : '');

      if (user) {
        console.log("[DB] Inserting interview for user:", user.id, "score:", result.overallScore);
        const { data: insertedRow, error: insertError } = await supabase
          .from('interviews')
          .insert({
            user_id: user.id,
            overall_score: result.overallScore || 0,
            role_target: roleStr,
            report_data: result,
          })
          .select('id')
          .single();

        console.log("[DB] Insert result:", insertedRow, "error:", insertError);

        if (insertedRow && !insertError) {
          databaseId = insertedRow.id;
          console.log("[DB] Saved successfully! ID:", databaseId);
        } else if (insertError) {
          console.error("[DB] Insert failed:", insertError.message, insertError.details, insertError.hint);
        }
      }
    } catch (dbErr: any) {
      console.error("[DB] Unexpected error:", dbErr.message);
    }
    // --------- END DB INJECTION ---------

    return NextResponse.json({ success: true, result, databaseId });

  } catch (error: any) {
    if (tmpFilePath) {
       await fs.unlink(tmpFilePath).catch(()=>{});
    }
    return NextResponse.json({ 
      error: error.message || "The Gemini API failed to analyze the video.",
      success: false 
    }, { status: 500 });
  }
}
