"use client";

import { useEffect, useState } from "react";

type Event = { id: number; title: string; location: string; starts_at: string };

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <main>
      <h1>Hello WhatsUp.</h1>
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