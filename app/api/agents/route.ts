import { NextResponse } from 'next/server';
import { blogTeam } from '@/lib/blogTeam';
import { db } from '@/db';
import { runs } from '@/db/schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  if (!topic) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  try {
    // Create initial run record
    const run = await db.insert(runs).values({
      topic,
      status: 'RUNNING',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    const runId = run[0].id;

    const output = await blogTeam.start({ topic });

    // Update run record with final status and output
    await db.insert(runs)
      .values({
        topic,
        status: output.status,
        output: output.result,
        updatedAt: new Date(),
        logs: output.stats
      });

    return NextResponse.json({ 
      runId,
      output 
    });

  } catch (error) {
    console.error('Error in agent workflow:', error);
    return NextResponse.json({ error: 'Failed to generate social media content' }, { status: 500 });
  }
}