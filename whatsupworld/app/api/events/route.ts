import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "select id, title, location, starts_at from events order by starts_at"
    );
    return Response.json(result.rows);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load events" }, { status: 500 });
  }
}