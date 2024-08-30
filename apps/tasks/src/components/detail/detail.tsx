import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteTask,
  readTask,
  Task,
  updateTask,
} from '../../utils/tasks-storage';
import { classNames } from '../../utils/class-names';

export function Detail() {
  const [task, setTask] = useState<Task | null>(null);
  const { taskId } = useParams<{ taskId: string }>();

  useEffect(() => {
    if (!taskId) return;
    const task = readTask(taskId);
    setTask(task);
  }, [taskId]);

  const navigate = useNavigate();

  return (
    <div className="max-w-screen-md mr-auto">
      <div className="flex items-center space-x-4">
        <h1
          className={classNames(
            'text-2xl font-semibold',
            task?.completed ? 'line-through' : ''
          )}
        >
          {task?.name}
        </h1>

        <div className="flex items-center justify-end flex-1 space-x-3">
          <Link to="/tasks" className="italic hover:underline">
            Back to list
          </Link>

          <button
            className="italic hover:underline"
            onClick={() => {
              // setIsEditing((isEditing) => !isEditing);
              if (!taskId) return;
              const updatedTask = updateTask(taskId, {
                completed: !task?.completed,
              });
              setTask(updatedTask);
            }}
          >
            {task?.completed ? 'Reopen' : 'Complete'}
          </button>
          <Link to={`/tasks/${taskId}/edit`} className="italic hover:underline">
            Edit
          </Link>
          <button
            className="italic hover:underline"
            onClick={() => {
              if (!task) return;

              const response = window.confirm(
                `Are you sure you want to delete ${task.name}?`
              );

              if (response) {
                deleteTask(task.id);
                navigate('/tasks');
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className=" mt-8">
        <div className="flex items-start space-x-3">
          <div>
            <div className="">{task?.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
