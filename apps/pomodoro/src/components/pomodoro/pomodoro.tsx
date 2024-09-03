import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { readTask, Task } from '@todo-app/storage/tasks-storage';
import { readTimerStorage } from '@todo-app/storage/timer-storage';
import {
  createRecord,
  readRecords,
  Record,
} from '@todo-app/storage/records-storage';
import useTimer from '../../libs/timer/use-timer';
import { playDing } from '../../libs/ding';

// TODO: make a common ui library
function Section({
  label,
  isCollapsible = false,
  children,
}: {
  label?: string;
  isCollapsible?: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <section className="mt-8">
      {label && (
        <div className="py-2 border-b space-x-2 flex justify-between">
          <span className="font-semibold">{label}</span> {` `}
          {isCollapsible && (
            <button
              className="italic hover:underline"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? 'Expand' : 'Collapse'}
            </button>
          )}
        </div>
      )}

      {isCollapsible ? !collapsed && children : children}
    </section>
  );
}

function Pomodoro() {
  const [task, setTask] = useState<Task | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [duration, setWorkTime] = useState(0);
  const [breakDuration, setBreakTime] = useState(0);

  const timer = useTimer({
    onSessionFinish: () => {
      createRecord(task ? task.id : null, duration);
      setRecords(readRecords());

      playDing();

      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Timer Finished', {
              body: 'Your pomodoro session just finished',
            });
          }
        });
      }
    },
    onBreakSessionFinish: () => {
      playDing();
      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Timer Finished', {
              body: 'Your break session just finished',
            });
          }
        });
      }
    },
  });

  useEffect(() => {
    const selectedTaskId = readTimerStorage().selectedTaskId;
    if (!selectedTaskId) {
      setTask(null);
      return;
    }
    const task = readTask(selectedTaskId);
    setTask(task);
  }, []);

  useEffect(() => {
    setRecords(readRecords());
  }, []);

  useEffect(() => {
    const duration = readTimerStorage().duration;
    setWorkTime(duration);
  }, []);

  useEffect(() => {
    const breakDuration = readTimerStorage().breakDuration;
    setBreakTime(breakDuration);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const progressPercentage =
    timer.status === 'break'
      ? ((breakDuration - timer.timeLeft) / breakDuration) * 100
      : ((duration - timer.timeLeft) / duration) * 100;

  return (
    <div className="py-6 px-8">
      <div className="max-w-screen-sm mr-auto">
        <h1 className="text-2xl font-semibold">Pomodoro</h1>

        <section className="mt-8 py-8 space-y-4 flex flex-col items-center">
          {task && (
            <div className="text-center">
              <span>Working on</span>{' '}
              <Link
                to={`/tasks/${task.id}`}
                className="text-base font-medium italic hover:underline"
              >
                {task.name}
              </Link>
            </div>
          )}
          {/* <Timer /> */}
          <div className="flex flex-col items-center">
            <div className="w-72 text-center space-y-2">
              <span className="text-2xl font-semibold">
                {formatTime(timer.timeLeft)}
              </span>

              <progress
                className="w-full h-2 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-black [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-black"
                max="100"
                value={progressPercentage}
              ></progress>
            </div>
            <div className="flex space-x-3 mt-4">
              {timer.isActive && (
                <button
                  className="italic hover:underline"
                  onClick={() => {
                    timer.end();
                  }}
                >
                  {timer.status === 'break' ? 'End break' : 'End'}
                </button>
              )}

              {!timer.isActive && (
                <button
                  className="italic hover:underline"
                  onClick={() => {
                    timer.start();
                  }}
                >
                  {timer.status === 'break' ? 'Start break' : 'Start'}
                </button>
              )}

              {!timer.isActive && timer.status === 'work' && (
                <>
                  <Link
                    to="/pomodoro/select-task"
                    className="italic hover:underline"
                  >
                    Select a task
                  </Link>
                  <Link
                    to="/pomodoro/settings"
                    className="italic hover:underline"
                  >
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {records.length > 0 && (
          <Section label="Records">
            <div className="grid grid-cols-[auto_auto_1fr]">
              {records
                .sort((a, b) => {
                  return new Date(a.startedAt) < new Date(b.startedAt) ? 1 : -1;
                })
                .map((record) => (
                  <Fragment
                    key={record.id}
                    // className="flex space-x-3 py-2 border-b"
                  >
                    <div className="py-2 pr-1.5 border-b">
                      {new Intl.DateTimeFormat('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                      }).format(new Date(record.startedAt))}
                    </div>

                    <div className="py-2 px-1.5 border-b">
                      {formatTime(record.duration)}
                    </div>

                    <div className="py-2 px-1.5 border-b">
                      <Link
                        to={`/tasks/${record.selectedTaskId}`}
                        className={
                          record.selectedTaskId &&
                          readTask(record.selectedTaskId)?.completed
                            ? 'italic font-medium line-through hover:decoration-line-through-underline' // TODO: apply both underline and line through
                            : 'italic hover:underline font-medium'
                        }
                      >
                        {record.selectedTaskId
                          ? readTask(record.selectedTaskId)?.name
                          : ''}
                      </Link>
                    </div>
                  </Fragment>
                ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

export default Pomodoro;
