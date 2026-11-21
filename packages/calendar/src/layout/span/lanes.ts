export type LaneSegment = {
  week: number;
  startIndex: number;
  length: number;
};

type Interval = {
  startIndex: number;
  endIndex: number;
};

export type LaneBoard = Map<number, Interval[][]>;

export function createLaneBoard(): LaneBoard {
  return new Map();
}

function lanesOfWeek(board: LaneBoard, week: number): Interval[][] {
  const existing = board.get(week);
  if (existing) {
    return existing;
  }
  const created: Interval[][] = [];
  board.set(week, created);
  return created;
}

function isLaneFree(lane: Interval[] | undefined, segment: LaneSegment): boolean {
  const endIndex = segment.startIndex + segment.length;
  return (lane ?? []).every((taken) => taken.endIndex <= segment.startIndex || taken.startIndex >= endIndex);
}

function lowestFreeLane(lanes: Interval[][], segment: LaneSegment): number {
  const free = lanes.findIndex((lane) => isLaneFree(lane, segment));
  return free === -1 ? lanes.length : free;
}

function chooseLane(lanes: Interval[][], segment: LaneSegment, previousLane: number | null): number {
  const canKeep = previousLane !== null && isLaneFree(lanes[previousLane], segment);
  if (canKeep) {
    return previousLane;
  }
  return lowestFreeLane(lanes, segment);
}

function occupy(lanes: Interval[][], lane: number, segment: LaneSegment): void {
  while (lanes.length <= lane) {
    lanes.push([]);
  }
  lanes[lane]?.push({ startIndex: segment.startIndex, endIndex: segment.startIndex + segment.length });
}

export function placeSegments(board: LaneBoard, segments: LaneSegment[]): number[] {
  let previousLane: number | null = null;
  return segments.map((segment) => {
    const lanes = lanesOfWeek(board, segment.week);
    const lane = chooseLane(lanes, segment, previousLane);
    occupy(lanes, lane, segment);
    previousLane = lane;
    return lane;
  });
}
