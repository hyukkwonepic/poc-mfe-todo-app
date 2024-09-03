import { BrowserRouter, Route, Routes } from 'react-router-dom';
import List from '../list/list';
import Detail from '../detail/detail';
import Edit from '../edit/edit';

export function TasksApp() {
  return (
    <div className="py-6 px-8">
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/:taskId" element={<Detail />} />
        <Route path="/:taskId/edit" element={<Edit />} />
      </Routes>
    </div>
  );
}

export default TasksApp;
