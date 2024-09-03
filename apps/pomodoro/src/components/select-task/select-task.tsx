import { readTasks, Task } from '@todo-app/storage/tasks-storage';
import { useEffect, useState } from 'react';

import {
  readTimerStorage,
  updateTimerStorage,
} from '@todo-app/storage/timer-storage';
import { useNavigate } from 'react-router-dom';

export function SelectTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTasks(readTasks());
  }, []);

  useEffect(() => {
    // const selectedTaskId = readTimerStorage().selectedTaskId;
    setSelectedTaskId(readTimerStorage().selectedTaskId);
  }, []);

  return (
    <div className="py-6 px-8">
      <div className="max-w-screen-sm mr-auto">
        <h1 className="text-2xl font-semibold">Select a Task</h1>

        <section className="mt-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.target as HTMLFormElement);
              const selectedTaskId = data.get('selectedTask') as string;
              if (!selectedTaskId) {
                alert('Please select a task');
                return;
              }

              updateTimerStorage({ selectedTaskId });

              navigate('/pomodoro');
            }}
          >
            {tasks
              .filter((task) => !task.completed)
              .map((task) => {
                return (
                  <label
                    key={task.id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="selectedTask"
                      value={task.id}
                      className=" accent-zinc-800"
                      defaultChecked={task.id === selectedTaskId}
                    />
                    <span className="text-zinc-700 peer-checked:text-zinc-500">
                      {task.name}
                    </span>
                  </label>
                );
              })}

            <div className="space-x-3 mt-4">
              <button
                type="button"
                className="italic hover:underline"
                onClick={() => {
                  navigate('/pomodoro');
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="italic hover:underline"
                onClick={() => {
                  updateTimerStorage({ selectedTaskId: null });
                  navigate('/pomodoro');
                }}
              >
                Unset
              </button>
              <button type="submit" className="italic hover:underline">
                Select
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SelectTask;
