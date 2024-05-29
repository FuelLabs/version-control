/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { getReposAndDependencies } from '../utils/dependencies';

const REPOS = [
  {
    name: 'fuel-core',
    version: '0.26.0',
    isCorrect: true,
  },
  {
    name: 'sway',
    version: '0.59.0',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.26.0',
      },
    ],
  },
  {
    name: 'fuels-ts',
    version: '0.88.1',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.26.0',
      },
      {
        name: 'sway',
        version: '0.59.0',
      },
    ],
  },
  {
    name: 'fuels-wallet',
    version: '0.20.0',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.26.0',
      },
      {
        name: 'sway',
        version: '0.59.0',
      },
      {
        name: 'fuels-ts',
        version: '0.88.1',
      },
    ],
  },
  {
    name: 'fuel-connectors',
    version: '0.5.0',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.26.0',
      },
      {
        name: 'fuels-ts',
        version: '0.88.1',
      },
    ],
  },
  {
    name: 'fuel-block-committer',
    version: '0.4.0',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.26.0',
      },
    ],
  },
  {
    name: 'fuel-bridge',
    version: '0.5.0',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.26.0',
      },
      {
        name: 'fuels-ts',
        version: '0.85.0',
      },
      {
        name: 'fuel-block-committer',
        version: '0.4.0',
      },
    ],
  },
  {
    name: 'fuel-explorer/explorer',
    version: '0.0.1',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.26.0',
      },
      {
        name: 'fuels-ts',
        version: '0.88.1',
      },
    ],
  },
  {
    name: 'fuel-explorer/bridge',
    version: '0.0.1',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.26.0',
      },
      {
        name: 'fuels-ts',
        version: '0.88.1',
      },
      {
        name: 'fuel-connectors',
        version: '0.5.0',
      },
    ],
  },
];

export const useStableVersion = () => {
  const [repos, setRepos] = useState<any>([]);
  useEffect(() => {
    const getRepos = async () => {
      const analyzedRepos = await getReposAndDependencies(REPOS);

      setRepos(analyzedRepos);
    };

    getRepos();
  }, []);

  return { repos };
};
