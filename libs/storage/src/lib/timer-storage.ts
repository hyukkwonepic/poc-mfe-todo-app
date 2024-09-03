const STORAGE_KEY = 'timer';

export interface TimerStorage {
  isActive: boolean;
  timeLeft: number;
  status: 'work' | 'break';
  selectedTaskId: string | null;
  duration: number;
  breakDuration: number;
}

type TimerStorageUpdates = Partial<TimerStorage>;

export function createTimerStorage(): TimerStorage {
  const newTimerStorage: TimerStorage = {
    isActive: false,
    timeLeft: 25 * 60,
    status: 'work',
    selectedTaskId: null,
    duration: 25 * 60,
    breakDuration: 5 * 60,
  };
  saveTimerStorage(newTimerStorage);
  return newTimerStorage;
}

export function readTimerStorage(): TimerStorage {
  const settingsJson = localStorage.getItem(STORAGE_KEY);
  return settingsJson ? JSON.parse(settingsJson) : createTimerStorage();
}

export function updateTimerStorage(updates: TimerStorageUpdates): TimerStorage {
  const currentSettings = readTimerStorage();
  const updatedTimerStorage: TimerStorage = {
    ...currentSettings,
    ...updates,
  };
  saveTimerStorage(updatedTimerStorage);
  return updatedTimerStorage;
}

function saveTimerStorage(timerStorage: TimerStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timerStorage));
}
