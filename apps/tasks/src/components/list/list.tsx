import { Link } from 'react-router-dom';
import {
  createTask,
  deleteTask,
  readTasks,
  Task,
  updateTask,
} from '../../utils/tasks-storage';
import { useEffect, useState } from 'react';
import TaskForm from '../task-form/task-form';
import { classNames } from '../../utils/class-names';

function TaskItem({
  task,
  onCompletionToggle,
  onDelete,
}: {
  task: Task;
  onCompletionToggle: (checked: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <Link to={`/tasks/${task.id}`}>
      <div className="flex justify-between  py-3 border-b border-solid hover:underline">
        <div className="space-x-2 flex items-start">
          <div className={task.completed ? 'opacity-30' : ''}>
            <div
              className={classNames(
                'font-medium',
                task.completed ? 'line-through' : ''
              )}
            >
              {task.name}
            </div>
            {task.description && (
              <div className="text-sm">{task.description}</div>
            )}
          </div>
        </div>

        <div className="justify-self-end space-x-3">
          <button
            className="italic hover:underline"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              onCompletionToggle(!task.completed);
            }}
          >
            {task.completed ? 'Reopen' : 'Complete'}
          </button>
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

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setTasks(readTasks());
  }, []);

  const handleCompletionToggle = (task: Task) => (checked: boolean) => {
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

  const handleDelete = (task: Task) => () => {
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
              key={task.id}
              task={task}
              onCompletionToggle={handleCompletionToggle(task)}
              onDelete={handleDelete(task)}
            />
          );
        })}
        <div>
          {isAdding === false && (
            <button
              className="italic w-full text-left hover:underline py-3"
              onClick={() => {
                setIsAdding(true);
              }}
            >
              + Add task
            </button>
          )}
          {isAdding === true && (
            <TaskForm
              onSubmit={({ name, description }, event) => {
                const newTask = createTask(name, description);
                setTasks([...tasks, newTask]);
              }}
              onCancel={() => {
                setIsAdding(false);
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
                key={task.id}
                task={task}
                onCompletionToggle={handleCompletionToggle(task)}
                onDelete={handleDelete(task)}
              />
            );
          })}
        </Section>
      )}
    </div>
  );
}

export default List;
