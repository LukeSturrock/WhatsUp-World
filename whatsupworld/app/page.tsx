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
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">WhatsUp</p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">What&apos;s happening this week</h1>
      {!loading && !error && (
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {events.length} upcoming {events.length === 1 ? "event" : "events"}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {loading && [1, 2, 3].map((n) => <CardSkeleton key={n} />)}

        {error && (
          <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            Couldn&apos;t load events: {error}
          </p>
        )}

        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </main>
  );
}

function EventCard({ event }: { event: Event }) {
  const date = new Date(event.starts_at);
  const month = date.toLocaleDateString(undefined, { month: "short" }); // "Oct"
  const day = date.getDate(); // 10
  const when = date.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" }); // "Sat 8:00 PM"

  return (
    <article className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Calendar-style date block */}
      <div className="w-14 shrink-0 rounded-lg bg-blue-50 py-1.5 text-center text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        <div className="text-xs">{month}</div>
        <div className="text-2xl font-semibold leading-tight">{day}</div>
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold">{event.title}</h2>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <PinIcon /> {event.location}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <ClockIcon /> {when}
          </span>
        </p>
      </div>
    </article>
  );
}

// Grey placeholder shown while the events are loading.
function CardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="h-14 w-14 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
