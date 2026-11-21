import { calendarDays, calendarHours, calendarViews, todayId, weekStrip } from "./constants";
import { calendarEventStyles, calendarMockStyles, eventRows } from "./style";

type CalendarDay = (typeof calendarDays)[number];

type DayColumnProps = {
  day: CalendarDay;
};

const styles = calendarMockStyles();

function DayColumn({ day }: DayColumnProps) {
  return (
    <div className={styles.column()}>
      {day.events.map((event) => (
        <div
          className={calendarEventStyles({
            tone: event.tone,
            isLifted: "isLifted" in event,
            class: [eventRows.start[event.start - 1], eventRows.span[event.span - 1]],
          })}
          key={event.id}
        >
          <span className={styles.eventTitle()}>{event.title}</span>
          {event.time ? <span className={styles.eventTime()}>{event.time}</span> : null}
        </div>
      ))}
      {day.isToday ? <span className={styles.now()} /> : null}
    </div>
  );
}

function HourLabels() {
  return (
    <div className={styles.hours()}>
      {calendarHours.map((hour) => (
        <span className={styles.hour()} key={hour}>
          {hour}
        </span>
      ))}
    </div>
  );
}

function WeekView() {
  return (
    <div className={styles.week()}>
      <div className={styles.weekHead()}>
        <span className={styles.spacer()} />
        <div className={styles.heads()}>
          {calendarDays.map((day) => (
            <span className={styles.head()} key={day.id}>
              {day.name}
              <span className={day.isToday ? styles.dateToday() : styles.date()}>{day.date}</span>
            </span>
          ))}
        </div>
      </div>
      <div className={styles.grid()}>
        <HourLabels />
        <div className={styles.columns()}>
          {calendarDays.map((day) => (
            <DayColumn day={day} key={day.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayView() {
  const today = calendarDays.find((day) => day.id === todayId);

  return (
    <div className={styles.day()}>
      <div className={styles.strip()}>
        {weekStrip.map((day) => (
          <span className={day.id === todayId ? styles.stripToday() : styles.stripDay()} key={day.id}>
            {day.name}
            <span className={styles.stripDate()}>{day.date}</span>
          </span>
        ))}
      </div>
      <div className={styles.grid()}>
        <HourLabels />
        <div className={styles.dayColumns()}>{today ? <DayColumn day={today} /> : null}</div>
      </div>
    </div>
  );
}

export function CalendarMock() {
  return (
    <div aria-label="Preview of the calendar: the week of November 16, 2026" className={styles.shell()} role="img">
      <div className={styles.calendar()}>
        <div className={styles.bar()}>
          <span className={styles.month()}>
            November <span className={styles.year()}>2026</span>
          </span>
          <span className={styles.views()}>
            {calendarViews.map((view) => (
              <span className={view.isCurrent ? styles.viewCurrent() : styles.view()} key={view.id}>
                {view.label}
              </span>
            ))}
          </span>
        </div>
        <WeekView />
        <DayView />
      </div>
    </div>
  );
}
