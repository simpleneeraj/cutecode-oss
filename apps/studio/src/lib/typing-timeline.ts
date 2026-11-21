export enum TypingSpeed {
  Slow = "slow",
  Normal = "normal",
  Fast = "fast",
}

export type TypingEvent = { atMs: number; code: string };

export type TypingTimeline = {
  durationMs: number;
  codeAt: (timeMs: number) => string;
};

const characterDelayMs = {
  [TypingSpeed.Slow]: 70,
  [TypingSpeed.Normal]: 40,
  [TypingSpeed.Fast]: 22,
};

const pauseMs = { line: 220, punctuation: 110 };

const maxIdleGapMs = 1200;

function jitter(index: number) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return 0.7 + (value - Math.floor(value)) * 0.6;
}

function delayAfter(character: string, index: number, speed: TypingSpeed) {
  const base = characterDelayMs[speed] * jitter(index);
  if (character === "\n") return base + pauseMs.line;
  if (";{}(),".includes(character)) return base + pauseMs.punctuation;
  return base;
}

function countPassedTimes(times: number[], timeMs: number) {
  let low = 0;
  let high = times.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (times[middle] <= timeMs) low = middle + 1;
    else high = middle;
  }
  return low;
}

export function createReplayTimeline(code: string, speed: TypingSpeed, holdMs: number): TypingTimeline {
  const characters = Array.from(code);
  const times: number[] = [];
  let elapsed = 0;

  characters.forEach((character, index) => {
    times.push(elapsed);
    elapsed += delayAfter(character, index, speed);
  });

  return {
    durationMs: Math.ceil(elapsed + holdMs),
    codeAt: (timeMs) => characters.slice(0, countPassedTimes(times, timeMs)).join(""),
  };
}

export function createRecordedTimeline(events: TypingEvent[], holdMs: number): TypingTimeline {
  const times: number[] = [];
  let elapsed = 0;

  events.forEach((event, index) => {
    if (index > 0) elapsed += Math.min(event.atMs - events[index - 1].atMs, maxIdleGapMs);
    times.push(elapsed);
  });

  return {
    durationMs: Math.ceil(elapsed + holdMs),
    codeAt: (timeMs) => events[countPassedTimes(times, timeMs) - 1]?.code ?? "",
  };
}
