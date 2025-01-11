import { NextResponse } from "next/server";
import { db } from '@/db';
import { runs, logEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop(); // Extract the ID from the URL

        if (!id) {
            return NextResponse.json({ error: "Run ID is required" }, { status: 400 });
        }

        const runId = parseInt(id);
        if (isNaN(runId)) {
            return NextResponse.json({ error: "Invalid Run ID" }, { status: 400 });
        }

        const run = await db.query.runs.findFirst({
            where: eq(runs.id, runId),
        });

        if (!run) {
            return NextResponse.json({ error: "Run not found" }, { status: 404 });
        }

        const events = await db.query.logEvents.findMany({
            where: eq(logEvents.runId, runId),
            orderBy: (logEvents, { desc }) => [desc(logEvents.timestamp)],
        });

        return NextResponse.json({
            run,
            events,
        });
    } catch (error) {
        console.error("Error fetching run:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
