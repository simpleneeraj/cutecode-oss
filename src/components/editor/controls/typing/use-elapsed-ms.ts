import { useEffect, useState } from "react";

export default function useElapsedMs(startedAt: number | null) {
  const [now, setNow] = useState(() => performance.now());

  useEffect(() => {
    if (startedAt === null) return;
    const id = setInterval(() => setNow(performance.now()), 250);
    return () => clearInterval(id);
  }, [startedAt]);

  if (startedAt === null) return 0;
  return Math.max(0, now - startedAt);
}
