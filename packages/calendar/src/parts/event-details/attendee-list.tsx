import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { ClockCircleIcon } from "@solar-icons/react/linear/clock-circle";
import { CloseCircleIcon } from "@solar-icons/react/linear/close-circle";
import { QuestionCircleIcon } from "@solar-icons/react/linear/question-circle";
import { UsersGroupRoundedIcon } from "@solar-icons/react/linear/users-group-rounded";
import type { Icon } from "@solar-icons/react/lib/types";

import { Attendance, type Attendee } from "../../types";
import { eventDetailsStyles } from "./style";

type AttendeeListProps = {
  attendees: Attendee[];
};

const attendanceIcons: Record<Attendance, Icon> = {
  [Attendance.Accepted]: CheckCircleIcon,
  [Attendance.Tentative]: QuestionCircleIcon,
  [Attendance.Declined]: CloseCircleIcon,
  [Attendance.Pending]: ClockCircleIcon,
};

const attendanceWords: Record<Attendance, string> = {
  [Attendance.Accepted]: "Going",
  [Attendance.Tentative]: "Maybe",
  [Attendance.Declined]: "Not going",
  [Attendance.Pending]: "Invited",
};

const styles = eventDetailsStyles();

function AttendeeList({ attendees }: AttendeeListProps) {
  return (
    <div className={styles.row()}>
      <UsersGroupRoundedIcon aria-hidden="true" className={styles.rowIcon()} />
      <ul className={styles.people()}>
        {attendees.map((attendee) => {
          const AnswerIcon = attendanceIcons[attendee.attendance];
          return (
            <li key={attendee.id} className={styles.person()}>
              <span className={styles.personName()}>{attendee.name}</span>
              <span className={styles.answer()}>
                <AnswerIcon aria-hidden="true" className={styles.answerIcon()} />
                {attendanceWords[attendee.attendance]}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { AttendeeList };
