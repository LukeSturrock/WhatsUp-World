"use client";

import { useEffect, useState } from "react";

type Event = { id: number; title: string; location: string; starts_at: string };

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then(async (res) => {
        const data = await res.json();
        // The API sends { error: "..." } when something goes wrong, not a list.
        if (!res.ok) throw new Error(data.error ?? "Request failed");
        setEvents(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Hello WhatsUp.</h1>
      {loading && <p>Loading events…</p>}
      {error && <p>Could not load events: {error}</p>}
      <ul>
        {events.map((e) => (
          <li key={e.id}>
            <strong>{e.title}</strong> — {e.location},{" "}
            {new Date(e.starts_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
