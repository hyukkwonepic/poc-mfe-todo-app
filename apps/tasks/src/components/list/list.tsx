import { Link } from 'react-router-dom';
import {
  createTask,
  deleteTask,
  readTasks,
  Task,
  updateTask,
} from '../../utils/tasks-storage';
import { FormEvent, useEffect, useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (checked: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <Link to={`/tasks/${task.id}`}>
      <div className="flex justify-between  py-3 border-b border-solid">
        <div className="space-x-2 flex items-start">
          <div>
            <input
              onChange={(event) => onToggle(event.target.checked)}
              onClick={(event) => {
                event.stopPropagation();
              }}
              type="checkbox"
              checked={task.completed}
              className={classNames(
                'w-4 h-4 m-1 accent-black cursor-pointer',
                task.completed ? 'opacity-30' : ''
              )}
            />
          </div>

          <div className={task.completed ? 'opacity-30' : ''}>
            <div>{task.name}</div>
            {task.description && (
              <div className="text-sm">{task.description}</div>
            )}
          </div>
        </div>

        <div className="justify-self-end">
          <button
            className="italic hover:underline"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  );
}

function TaskForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (
    data: { name: string; description: string },
    event: FormEvent<HTMLFormElement>
  ) => void;
  onCancel: () => void;
}) {
  return (
    <div className=" border border-zinc-200 bg-zinc-50 rounded p-3 mt-3">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formElement = event.target as HTMLFormElement;
          const data = new FormData(formElement);
          const name = data.get('name') as string;
          let description = data.get('description') as string;

          if (!name) {
            alert('Name is required');
            return;
          }

          if (!description) {
            description = '';
          }

          onSubmit({ name, description }, event);
          formElement.reset();
        }}
      >
        <div className="space-y-2">
          <div className="flex flex-col">
            <input
              name="name"
              type="text"
              placeholder="Task name"
              className="placeholder:text-gray-600 p-2 rounded-sm  border border-zinc-200"
            />
          </div>
          <div className="flex flex-col">
            <textarea
              name="description"
              placeholder="Description"
              className="placeholder:text-gray-600 p-2 rounded-sm  border border-zinc-200"
            />
          </div>
        </div>
        {/* <hr className="my-4" /> */}
        <div className="flex justify-end space-x-2 mt-3">
          <button
            type="button"
            className="italic hover:underline py-3"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className="italic hover:underline py-3" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

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
        <div className="py-3 border-b space-x-2 flex justify-between">
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

export function List() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const completedTasks = tasks.filter((task) => task.completed);
  const uncompletedTasks = tasks.filter((task) => !task.completed);

  const [foo, setFoo] = useState(false);

  useEffect(() => {
    setTasks(readTasks());
  }, []);

  const toggle = (task: Task) => (checked: boolean) => {
    const updatedTask = updateTask(task.id, {
      completed: checked,
    });

    setTasks(
      tasks.reduce<Task[]>((acc, cv) => {
        if (cv.id === task.id) {
          if (updatedTask === null) return acc;
          return [...acc, updatedTask];
        }
        return [...acc, cv];
      }, [])
    );
  };

  const bar = (task: Task) => () => {
    const response = window.confirm(
      `Are you sure you want to delete ${task.name}?`
    );

    if (response) {
      deleteTask(task.id);
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
  };

  return (
    <div className="max-w-screen-md mr-auto">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <Section>
        {uncompletedTasks.map((task) => {
          return (
            <TaskItem
              task={task}
              onToggle={toggle(task)}
              onDelete={bar(task)}
            />
          );
        })}
        <div>
          {foo === false && (
            <button
              className="italic w-full text-left hover:underline py-3"
              onClick={() => {
                setFoo(true);
              }}
            >
              + Add task
            </button>
          )}
          {foo === true && (
            <TaskForm
              onSubmit={({ name, description }, event) => {
                const newTask = createTask(name, description);
                setTasks([...tasks, newTask]);
              }}
              onCancel={() => {
                setFoo(false);
              }}
            />
          )}
        </div>
      </Section>
      {completedTasks.length > 0 && (
        <Section label="Completed" isCollapsible>
          {completedTasks.map((task) => {
            return (
              <TaskItem
                task={task}
                onToggle={toggle(task)}
                onDelete={bar(task)}
              />
            );
          })}
        </Section>
      )}
    </div>
  );
}

export default List;
