import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'pomodoro',

  exposes: {
    './PomodoroApp': './src/remote-entry.ts',
  },
};

export default config;
