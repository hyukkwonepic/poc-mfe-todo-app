import { Route, Routes } from 'react-router-dom';
import SelectTask from '../select-task/select-task';
import Pomodoro from '../pomodoro/pomodoro';
import Settings from '../settings/settings';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Pomodoro />} />
      <Route path="/select-task" element={<SelectTask />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
