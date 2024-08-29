import * as React from 'react';

import NxWelcome from './nx-welcome';
import TasksApp from 'tasks/TasksApp';

import { Link, Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
          <Link to="/tasks">Tasks</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="app-shell" />} />
        <Route path="/tasks" element={<TasksApp />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
