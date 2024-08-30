import * as React from 'react';

import TasksApp from 'tasks/TasksApp';

import { NavLink, Route, Routes, To } from 'react-router-dom';

function SidebarNavLink({
  to,
  children,
}: {
  to: To;
  children: React.ReactNode;
}) {
  const baseClasses = 'block italic py-2 w-full';
  const activeClasses = 'underline';
  const inactiveClasses = 'hover:underline';

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      {children}
    </NavLink>
  );
}

export function App() {
  return (
    <React.Suspense fallback={null}>
      <div className="grid grid-cols-[256px_1fr] min-h-screen h-screen">
        <aside className="px-8 py-6 border-r border-r-zinc-200">
          <div className="text-2xl font-semibold tracking-tighter ">
            "Hello, Todo!"
          </div>
          <div className="mt-8">
            <SidebarNavLink to="/tasks">Tasks</SidebarNavLink>
            <SidebarNavLink to="/pomodoro">Pomodoro</SidebarNavLink>
          </div>
        </aside>
        <main className="overflow-auto">
          <Routes>
            <Route path="/tasks" element={<TasksApp />} />
          </Routes>
        </main>
      </div>
    </React.Suspense>
  );
}

export default App;
