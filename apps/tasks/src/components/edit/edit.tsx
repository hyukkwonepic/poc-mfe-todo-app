import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { readTask, Task, updateTask } from '../../utils/tasks-storage';
import TaskForm from '../task-form/task-form';

export function Edit() {
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
      <h1 className="text-2xl font-semibold">Edit task</h1>

      <div className=" mt-8">
        <TaskForm
          defaultValues={{
            name: task?.name,
            description: task?.description,
          }}
          onSubmit={({ name, description }) => {
            if (!taskId) return;

            updateTask(taskId, {
              name,
              description,
            });
            navigate(`/tasks/${taskId}`);
          }}
          onCancel={function (): void {
            navigate(`/tasks/${taskId}`);
          }}
        />
      </div>
    </div>
  );
}

export default Edit;
