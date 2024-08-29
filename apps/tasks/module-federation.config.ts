import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'tasks',

  exposes: {
    './TasksApp': './src/remote-entry.ts',
  },
};

export default config;
