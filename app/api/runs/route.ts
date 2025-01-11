import { NextResponse } from "next/server";
import { db } from '@/db';
import { runs } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        const allRuns = await db.query.runs.findMany({
            orderBy: [desc(runs.createdAt)],
            limit,
            offset,
        });

        return NextResponse.json({
            runs: allRuns,
        });
    } catch (error) {
        console.error("Error fetching runs:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 