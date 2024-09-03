import {
  readTimerStorage,
  updateTimerStorage,
} from '@todo-app/storage/timer-storage';

interface State {
  status: 'work' | 'break';
  timeLeft: number;
  isActive: boolean;
  duration: number;
  breakDuration: number;
}

class Timer {
  state: State;
  interval: number | null = null;
  listeners: Set<(state: State) => void> = new Set();
  onSessionFinishCallback?: () => void;
  onBreakSessionFinishCallback?: () => void;

  constructor() {
    const timerStorage = readTimerStorage();
    this.state = {
      status: timerStorage.status,
      timeLeft: timerStorage.timeLeft,
      isActive: timerStorage.isActive,
      duration: timerStorage.duration,
      breakDuration: timerStorage.breakDuration,
    };

    if (this.state.isActive) {
      this.start();
    }
  }

  subscribe(listener: (state: State) => void) {
    this.listeners.add(listener);
    listener(this.state); // Immediately call listener with current state
    return () => {
      this.listeners.delete(listener);
    };
  }

  start() {
    if (this.interval) return;

    this.state.isActive = true;
    updateTimerStorage({ ...this.state });
    this.listeners.forEach((listener) => listener({ ...this.state }));

    this.interval = window.setInterval(() => {
      const { isActive, status, timeLeft } = this.state;
      if (isActive && timeLeft > 0) {
        this.state = {
          ...this.state,
          timeLeft: this.state.timeLeft - 1,
        };
      }

      if (isActive && status === 'work' && timeLeft === 0) {
        if (!this.interval) return;
        window.clearInterval(this.interval);
        this.interval = null;
        const { breakDuration } = this.state;

        this.state = {
          ...this.state,
          isActive: false,
          status: 'break',
          timeLeft: breakDuration,
        };

        this.onSessionFinishCallback?.();
      }

      if (isActive && status === 'break' && timeLeft === 0) {
        if (!this.interval) return;
        window.clearInterval(this.interval);
        this.interval = null;
        const { duration } = this.state;

        this.state = {
          ...this.state,
          isActive: false,
          status: 'work',
          timeLeft: duration,
        };

        this.onBreakSessionFinishCallback?.();
      }

      updateTimerStorage({ ...this.state });
      this.listeners.forEach((listener) => listener({ ...this.state }));
    }, 1000);
  }

  end() {
    if (!this.interval) return;
    window.clearInterval(this.interval);
    this.interval = null;
    const { duration } = this.state;

    this.state = {
      ...this.state,
      status: 'work',
      timeLeft: duration,
      isActive: false,
    };
    updateTimerStorage({ ...this.state });
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  setOnSessionFinishCallback(callback: () => void) {
    this.onSessionFinishCallback = callback;
  }

  setOnBreakSessionFinishCallback(callback: () => void) {
    this.onBreakSessionFinishCallback = callback;
  }

  setDuration(duration: number) {
    this.state = {
      ...this.state,
      duration: duration,
      timeLeft: this.state.status === 'work' ? duration : this.state.timeLeft,
    };
    updateTimerStorage({ ...this.state });
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  setBreakDuration(breakDuration: number) {
    this.state = {
      ...this.state,
      breakDuration: breakDuration,
      timeLeft:
        this.state.status === 'break' ? breakDuration : this.state.timeLeft,
    };
    updateTimerStorage({ ...this.state });
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }
}

export const timer = new Timer();
