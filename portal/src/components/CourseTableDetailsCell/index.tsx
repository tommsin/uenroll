import React, { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Header } from "semantic-ui-react";
import { OpenedCourse, TimeSlot } from "../../types";

import { useTimeSlot } from "../../contexts/TimeSlotProvider";
import ConfirmModal from "../ConfirmModal";
import styles from "./styles.module.css";

interface CourseTableDetailsCellRowItemProps {
  section: string;
  instructor: string;
  timeSlots: TimeSlot[];
  venue: string;
  capacity: number;
  openSeats: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CourseTableDetailsCellRowItem: React.FC<
  CourseTableDetailsCellRowItemProps
> = (props) => {
  const {
    section,
    instructor,
    timeSlots,
    venue,
    capacity,
    openSeats,
    onEdit,
    onDelete,
  } = props;
  const intl = useIntl();

  return (
    <div className={styles.row} style={{ minWidth: 1000 }}>
      <div style={{ width: 50 }}>{section}</div>
      <div style={{ width: 150 }}>
        <p>{timeSlots[0].dayOfWeek}</p>
        <p>
          <FormattedMessage
            id="CourseTableDetailsCellRowItem.time-slot.time"
            values={{
              start: intl.formatTime(timeSlots[0].start),
              end: intl.formatTime(timeSlots.slice(-1)[0].end),
            }}
          />
        </p>
      </div>
      <div style={{ width: 200 }}>{venue}</div>
      <div style={{ width: 200 }}>{instructor}</div>
      <div style={{ width: 100 }}>
        <Button color="blue" onClick={onEdit}>
          <FormattedMessage id="CourseTableDetailsCellRowItem.edit-button.label" />
        </Button>
      </div>
      <div style={{ width: 100 }}>
        <Button color="red" onClick={onDelete}>
          <FormattedMessage id="CourseTableDetailsCellRowItem.delete-button.label" />
        </Button>
      </div>
      <div style={{ width: 200 }}>
        <FormattedMessage
          id="CourseTableDetailsCellRowItem.seats.label"
          values={{ openSeats, capacity }}
        />
      </div>
    </div>
  );
};

interface CourseTableDetailsCellProps {
  isAdmin?: boolean;
  openedCourses: OpenedCourse[];
  onEditOpenedCourse?: (course: OpenedCourse) => () => void;
  onDeleteOpenedCourse?: (course: OpenedCourse) => void;
  onAddOpenedCourse?: () => void;
  onEditCourse?: () => void;
  onDeleteCourse?: () => void;
  onAddToShoppingCart?: () => void;
}

const CourseTableDetailsCell: React.FC<CourseTableDetailsCellProps> = (
  props
) => {
  const {
    isAdmin,
    openedCourses,
    onEditOpenedCourse,
    onDeleteOpenedCourse,
    onAddOpenedCourse,
    onEditCourse,
    onDeleteCourse,
    onAddToShoppingCart,
  } = props;
  const { getTimeSlotsByIDs } = useTimeSlot();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteOpenedCourseTarget, setDeleteOpenedCourseTarget] =
    useState<OpenedCourse>();

  const onOpenConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const onCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const onConfirmDeleteCourse = useCallback(() => {
    if (deleteOpenedCourseTarget) {
      onDeleteOpenedCourse?.(deleteOpenedCourseTarget);
    } else {
      onDeleteCourse?.();
    }
    onCloseConfirmModal();
  }, [
    deleteOpenedCourseTarget,
    onCloseConfirmModal,
    onDeleteCourse,
    onDeleteOpenedCourse,
  ]);

  const onClickDeleteOpenedCourse = useCallback(
    (course: OpenedCourse) => () => {
      setDeleteOpenedCourseTarget(course);
      onOpenConfirmModal();
    },
    [onOpenConfirmModal]
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {openedCourses.length > 0 ? (
          <>
            <div className={styles.header} style={{ minWidth: 1000 }}>
              <div style={{ width: 50 }}>
                <FormattedMessage id="CourseTableDetailsCell.section.label" />
              </div>
              <div style={{ width: 150 }}>
                <FormattedMessage id="CourseTableDetailsCell.time-slot.label" />
              </div>
              <div style={{ width: 200 }}>
                <FormattedMessage id="CourseTableDetailsCell.venue.label" />
              </div>
              <div style={{ width: 200 }}>
                <FormattedMessage id="CourseTableDetailsCell.instructor.label" />
              </div>
              <div style={{ width: 100, visibility: "hidden" }} />
              <div style={{ width: 100, visibility: "hidden" }} />
              <div style={{ width: 200 }}>
                <FormattedMessage id="CourseTableDetailsCell.seats.label" />
              </div>
            </div>
            <div className={styles.body} style={{ minWidth: 1000 }}>
              {openedCourses.map((course) => (
                <CourseTableDetailsCellRowItem
                  {...course}
                  timeSlots={getTimeSlotsByIDs(course.timeSlotIds)}
                  openSeats={course.openSeats}
                  onEdit={onEditOpenedCourse?.(course)}
                  onDelete={onClickDeleteOpenedCourse(course)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.header}>
            <Header>
              <FormattedMessage id="CourseTableDetailsCell.no-opened-courses" />
            </Header>
          </div>
        )}
      </div>
      <div className={styles.footer}>
        {isAdmin ? (
          <>
            <Button color="green" onClick={onAddOpenedCourse}>
              <FormattedMessage id="CourseTableDetailsCell.add-button.label" />
            </Button>
            <Button color="blue" onClick={onEditCourse}>
              <FormattedMessage id="CourseTableDetailsCell.edit-button.label" />
            </Button>
            <Button color="red" onClick={onOpenConfirmModal}>
              <FormattedMessage id="CourseTableDetailsCell.delete-button.label" />
            </Button>
          </>
        ) : openedCourses.length > 0 ? (
          <Button color="orange" onClick={onAddToShoppingCart}>
            <FormattedMessage id="CourseTableDetailsCell.add-to-cart-button.label" />
          </Button>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={onConfirmDeleteCourse}
        onCancel={onCloseConfirmModal}
        headerTextID="CourseTableDetailsCell.confirm-delete-modal.header"
      >
        <FormattedMessage id="CourseTableDetailsCell.confirm-delete-modal.description" />
      </ConfirmModal>
    </div>
  );
};

export default CourseTableDetailsCell;
