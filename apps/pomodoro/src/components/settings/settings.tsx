import {
  readTimerStorage,
  updateTimerStorage,
} from '@todo-app/storage/timer-storage';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useTimer from '../../libs/timer/use-timer';

function Settings() {
  const durationInputRef = useRef<HTMLInputElement>(null);
  const breakDurationInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const timer = useTimer({});

  useEffect(() => {
    if (!durationInputRef.current) {
      return;
    }
    const duration = readTimerStorage().duration;

    if (!duration) {
      durationInputRef.current.value = '25';
      return;
    }
    durationInputRef.current.value = (duration / 60).toString();
  }, []);

  useEffect(() => {
    if (!breakDurationInputRef.current) {
      return;
    }
    const breakDuration = readTimerStorage().breakDuration;
    if (!breakDuration) {
      breakDurationInputRef.current.value = '5';
      return;
    }
    breakDurationInputRef.current.value = (breakDuration / 60).toString();
  }, []);

  return (
    <div className="py-6 px-8">
      <div className="max-w-screen-sm mr-auto">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <section className="mt-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.target as HTMLFormElement);
              const duration = data.get('duration') as string;
              const breakDuration = data.get('break-duration') as string;
              updateTimerStorage({
                duration: parseInt(duration, 10) * 60,
                breakDuration: parseInt(breakDuration, 10) * 60,
              });

              timer.setDuration(parseInt(duration, 10) * 60);
              timer.setBreakDuration(parseInt(breakDuration, 10) * 60);
              navigate('/pomodoro');
            }}
          >
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="font-medium" htmlFor="duration">
                  Duration (minutes)
                </label>
                <input
                  ref={durationInputRef}
                  id="duration"
                  name="duration"
                  type="number"
                  min={1}
                  max={60}
                  placeholder="25"
                  className="mt-2 placeholder:text-gray-600 p-2 rounded  border border-zinc-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="font-medium" htmlFor="duration">
                  Break duration (minutes)
                </label>
                <input
                  ref={breakDurationInputRef}
                  id="break-duration"
                  name="break-duration"
                  type="number"
                  min={1}
                  max={60}
                  placeholder="5"
                  className="mt-2 placeholder:text-gray-600 p-2 rounded  border border-zinc-200"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                type="button"
                className="italic hover:underline"
                onClick={() => {
                  navigate('/pomodoro');
                }}
              >
                Cancel
              </button>
              <button type="submit" className="italic hover:underline">
                Save
              </button>
            </div>
          </form>
          {/* </div> */}
        </section>
      </div>
    </div>
  );
}

export default Settings;
