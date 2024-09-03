MFE ideas

- tasks exposes Task link component to pomodoro
- pomodoro exposes Records list component to task
- when task is completed, event is emitted and pomodoro's tasks gets updated
- when pomodoro sessino is done, event is emitted and task gets updated.

About pomodoro

- A list should show the current pomodoro time of each task

- on the list, if pomodoro is running, the time should be shown in each task item
- on the list, if pomodoro is not running, if the task has a pomodoro records, show number of cycles and aggregated time. e.g. 4 cycles(avg 23.75 min), 95 minutes
  - technical detail: This should be a federated component.
- on the detail, show a pomodoro records section. List up all pomodoro records. Break times are not recorded.

  - e.g.
    - 19:05, Aug 31, 20 minutes
    - 19:26 Aug 31, 25 minutes
    - ...

- on the list and detail, show a 'start pomodoro' button. When clicked, redirect to the pomodoro mfe.

- on pomodoro
  - preferences
    - default short break time
    - default long break time
    - default sesson time
    - long break after
    - auto start break
