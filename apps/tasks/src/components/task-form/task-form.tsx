import { FormEvent } from 'react';

function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: { name?: string; description?: string };
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
            alert('Task name is required');
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
              defaultValue={defaultValues?.name}
            />
          </div>
          <div className="flex flex-col">
            <textarea
              name="description"
              placeholder="Description"
              className="placeholder:text-gray-600 p-2 rounded-sm  border border-zinc-200"
              defaultValue={defaultValues?.description}
            />
          </div>
        </div>
        {/* <hr className="my-4" /> */}
        <div className="flex justify-end space-x-3 mt-3">
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

export default TaskForm;
