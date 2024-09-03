import { useEffect, useState } from 'react';
import { timer } from '.';

function useTimer({
  onSessionFinish,
  onBreakSessionFinish,
}: {
  onSessionFinish?: () => void;
  onBreakSessionFinish?: () => void;
}) {
  const [state, setState] = useState(timer.state);

  useEffect(() => {
    timer.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  useEffect(() => {
    if (!onSessionFinish) return;
    timer.setOnSessionFinishCallback(onSessionFinish);
  });

  useEffect(() => {
    if (!onBreakSessionFinish) return;
    timer.setOnBreakSessionFinishCallback(onBreakSessionFinish);
  });

  return {
    status: state.status,
    timeLeft: state.timeLeft,
    isActive: state.isActive,
    start: timer.start.bind(timer),
    end: timer.end.bind(timer),
    setDuration: timer.setDuration.bind(timer),
    setBreakDuration: timer.setBreakDuration.bind(timer),
  };
}

export default useTimer;
