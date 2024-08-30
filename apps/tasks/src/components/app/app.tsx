import { BrowserRouter, Route, Routes } from 'react-router-dom';
import List from '../list/list';
import Detail from '../detail/detail';
import Edit from '../edit/edit';

export function TasksApp() {
  return (
    <div className="py-6 px-8">
      <BrowserRouter>
        <Routes>
          <Route path="/tasks" element={<List />} />
          <Route path="/tasks/:taskId" element={<Detail />} />
          <Route path="/tasks/:taskId/edit" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default TasksApp;
