/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchJsonUrl({ url }: { url: string }) {
  try {
    const response = await fetch(url);
    const packageJson = await response.json();
    return packageJson;
  } catch (error) {
    console.error(`Error fetching package version: ${error}`);
    return '';
  }
}

export function getVersionTag(version?: string) {
  return version ? `v${version}` : 'master';
}

export async function getFuelsTsDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);
  const url = `https://raw.githubusercontent.com/FuelLabs/fuels-ts/${tag}/packages/fuels/package.json`;
  const packageJson = await fetchJsonUrl({
    url,
  });

  const dependencies = await Promise.all(
    (repo?.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;

      if (dependency.name === 'fuel-core') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-ts/${tag}/packages/fuel-core/VERSION`;
        const response = await fetch(
          url
        );
        const version = (await response.text()).trim();
        return { ...dependency, version, url };
      }

      if (dependency.name === 'sway') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-ts/${tag}/packages/forc/VERSION`;
        const response = await fetch(
          url
        );
        const version = (await response.text()).trim();
        return { ...dependency, version, url };
      }

      return dependency;
    })
  );

  return { packageJson, dependencies, url };
}

export async function getFuelsWalletDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);
  const url = `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/${tag}/packages/app/package.json`;
  const packageJson = await fetchJsonUrl({
    url,
  });

  const dependencies = await Promise.all(
    (repo.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;
      if (dependency.name === 'fuel-core') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/${tag}/docker/fuel-core/Dockerfile`;
        const response = await fetch(
          url
        );
        const dockerfile = (await response.text()).trim();
        const regex = /FROM ghcr\.io\/fuellabs\/fuel-core:v([\d\.]+)/;
        const match = dockerfile.match(regex);

        if (match && match[1]) {
          const version = match[1];
          return { ...dependency, version, url };
        }
      }

      if (dependency.name === 'sway') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/${tag}/fuel-toolchain.toml`;
        const response = await fetch(
          url
        );
        const toolchain = (await response.text()).trim();
        const regex = /forc\s*=\s*"([\d\.]+)"/;
        const match = toolchain.match(regex);

        if (match && match[1]) {
          const version = match[1];
          return { ...dependency, version, url };
        }
      }

      if (dependency.name === 'fuels-ts') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/${tag}/packages/app/package.json`;
        const packageJson = await fetchJsonUrl({
          url,
        });
        const version = packageJson.dependencies?.fuels;
        return { ...dependency, version, url };
      }

      return dependency;
    })
  );

  return { packageJson, dependencies, url };
}

export async function getFuelBlockCommiterDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);
  const url = `https://raw.githubusercontent.com/FuelLabs/fuel-block-committer/${tag}/Cargo.toml`;
  const cargoToml = await fetch(
    url
  );
  const cargoTomlFile = (await cargoToml.text()).trim();
  const regex = /(?<!rust-)version\s*=\s*"([^"]+)"/;
  const match = regex.exec(cargoTomlFile);
  const version = match ? match[1] : null;

  const dependencies = await Promise.all(
    (repo.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;
      if (dependency.name === 'fuel-core') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuel-block-committer/${tag}/fuel-toolchain.toml`;
        const response = await fetch(
          url
        );
        const fuelToolchainFile = (await response.text()).trim();
        const regex = /fuel-core\s*=\s*"([^"]+)"/;
        const match = regex.exec(fuelToolchainFile);

        if (match && match[1]) {
          const version = match[1];
          return { ...dependency, version, url };
        }
      }
      if (dependency.name === 'sway') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuel-block-committer/${tag}/fuel-toolchain.toml`;
        const response = await fetch(
          url
        );
        const fuelToolchainFile = (await response.text()).trim();
        const regex = /forc\s*=\s*"([^"]+)"/;
        const match = regex.exec(fuelToolchainFile);

        if (match && match[1]) {
          const version = match[1];
          return { ...dependency, version, url };
        }
      }
    })
  );

  return { version, dependencies, url };
}

export async function getFuelsPortalDependencies(repo: any) {
  const url = `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/packages/app/package.json`;
  const packageJson = await fetchJsonUrl({
    url
  });

  const dependencies = await Promise.all(
    (repo.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;
      // 'fuel-core' 'sway' 'fuels-ts'
      if (dependency.name === 'fuel-core') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/docker/fuel-core/Dockerfile`;
        const response = await fetch(
          url
        );
        const dockerfile = (await response.text()).trim();
        const regex = /FROM ghcr\.io\/fuellabs\/fuel-core:v([\d\.]+)/;
        const match = dockerfile.match(regex);

        if (match && match[1]) {
          const version = match[1];
          return { ...dependency, version, url };
        }
      }

      if (dependency.name === 'fuels-ts') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/packages/app/package.json`;
        const packageJson = await fetchJsonUrl({
          url
        });
        const version = packageJson.dependencies.fuels;
        return { ...dependency, version, url };
      }

      if (dependency.name === 'fuels-wallet') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/packages/app/package.json`;
        const packageJson = await fetchJsonUrl({
          url,
        });
        const version = packageJson.dependencies['@fuel-wallet/sdk'];
        return { ...dependency, version, url };
      }

      if (dependency.name === 'fuel-bridge') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/packages/app/package.json`;
        const packageJson = await fetchJsonUrl({
          url,
        });
        const version =
          packageJson.dependencies['@fuel-bridge/message-predicates'];
        return { ...dependency, version, url };
      }
      if (dependency.name === 'fuel-block-committer') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/docker/block-committer/Dockerfile`;
        const response = await fetch(
          url
        );
        const dockerfile = (await response.text()).trim();

        const regex =
          /FROM ghcr\.io\/fuellabs\/fuel-block-committer:v([\d\.]+)/;
        const match = dockerfile.match(regex);

        if (match && match[1]) {
          const version = match[1];
          return { ...dependency, version, url };
        }
      }

      return dependency;
    })
  );

  return { packageJson, dependencies, url };
}

export async function getFuelBridgeDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);
  const url = `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/${tag}/packages/message-predicates/package.json`;
  const packageJson = await fetchJsonUrl({
    url,
  });

  const dependencies = await Promise.all(
    (repo.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;
      // 'fuel-core' 'sway' 'fuels-ts'
      if (dependency.name === 'fuel-core') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/${tag}/docker/fuel-core/Dockerfile`;
        const response = await fetch(
          url
        );
        const dockerfile = (await response.text()).trim();
        const regex = /FROM ghcr\.io\/fuellabs\/fuel-core:v([\d\.]+)/;
        const match = dockerfile.match(regex);

        if (match && match[1]) {
          const version = match[1];
          return { ...dependency, version, url };
        }
      }

      if (dependency.name === 'fuels-ts') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/${tag}/packages/integration-tests/package.json`;
        const packageJson = await fetchJsonUrl({
          url,
        });
        const version = packageJson.devDependencies.fuels;
        return { ...dependency, version, url };
      }

      if (dependency.name === 'fuel-block-committer') {
        const url = `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/${tag}/docker/block-committer/Dockerfile`;
        const response = await fetch(
          url
        );
        const dockerfile = (await response.text()).trim();

        const regex =
          /FROM ghcr\.io\/fuellabs\/fuel-block-committer:v([\d\.]+)/;
        const match = dockerfile.match(regex);

        if (match && match[1]) {
          const version = match[1];
          return { ...dependency, version, url };
        }
      }

      return dependency;
    })
  );

  return { packageJson, dependencies, url };
}

export async function getSwayDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);
  const url = `https://raw.githubusercontent.com/FuelLabs/sway/${tag}/forc/Cargo.toml`;
  const response = await fetch(
    url
  );
  const toolchain = (await response.text()).trim();
  const regex = /version\s*=\s*"([^"]+)"/;
  const match = toolchain.match(regex);

  let repoVersion: string = '';
  if (match && match[1]) {
    const version = match[1];
    repoVersion = version;
  }
  const dependencies = await Promise.all(
    (repo.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;
      if (dependency.name === 'fuel-core') {
        const url = `https://raw.githubusercontent.com/FuelLabs/sway/${getVersionTag(
          repoVersion
        )}/test/src/sdk-harness/Cargo.toml`;
        const response = await fetch(
          url
        );
        const tomlFile = (await response.text()).trim();
        const regex = /fuel-core\s*=\s*\{[^}]*version\s*=\s*"([^"]+)"/;
        const match = tomlFile.match(regex);

        if (match && match[1]) {
          const version = match[1];

          return { ...dependency, version, url };
        }
      }
    })
  );

  return { version: repoVersion, dependencies, url };
}

export async function getReposAndDependencies(rawRepos: any) {
  const repos = await Promise.all(
    rawRepos.map(async (repo: any) => {
      if (repo.name === 'sway') {
        const { version, dependencies, url } = await getSwayDependencies(repo);

        return {
          ...repo,
          url,
          dependencies,
          version,
        };
      }

      if (repo.name === 'fuels-ts') {
        const { packageJson, dependencies, url } = await getFuelsTsDependencies(
          repo
        );

        return {
          ...repo,
          url,
          dependencies,
          version: packageJson.version,
        };
      }

      if (repo.name === 'fuels-wallet') {
        const { packageJson, dependencies, url } = await getFuelsWalletDependencies(
          repo
        );

        return {
          ...repo,
          url,
          dependencies,
          version: repo.version || packageJson.version,
        };
      }

      if (repo.name === 'fuel-block-committer') {
        const { version, dependencies, url } =
          await getFuelBlockCommiterDependencies(repo);

        return {
          ...repo,
          url,
          dependencies,
          version,
        };
      }

      if (repo.name === 'fuels-portal') {
        const { packageJson, dependencies, url } = await getFuelsPortalDependencies(
          repo
        );

        return {
          ...repo,
          url,
          dependencies,
          version: packageJson.version,
        };
      }

      if (repo.name === 'fuel-bridge') {
        const { packageJson, dependencies, url } = await getFuelBridgeDependencies(
          repo
        );

        return {
          ...repo,
          url,
          dependencies,
          version: packageJson.version,
        };
      }

      return repo;
    })
  );

  const analyzedRepos = repos.reduce<(typeof repos)[0][]>((prev: any, repo) => {
    if (repo.isCorrect) return [...prev, repo];

    const dependencies = repo.dependencies?.map((_dependency: any) => {
      const dependency = _dependency || {};
      if (dependency.isCorrect) return dependency;

      const rootDependencyRepo: any = prev.find(
        (prevRepo: any) => prevRepo.name === dependency.name
      );

      return {
        ...dependency,
        notes: createNotes(rootDependencyRepo),
        needsToUpdateDeps: rootDependencyRepo?.isCorrect,
        isCorrect:
          dependency.version === rootDependencyRepo?.version &&
          rootDependencyRepo?.isCorrect,
      };
    });

    const isRepoCorrect = dependencies?.every(
      (dependency: any) => dependency.isCorrect
    );

    const repoData = {
      ...repo,
      isCorrect: isRepoCorrect,
      dependencies,
    };

    return [
      ...prev,
      {
        ...repoData,
        notes: createNotesRoot(repoData),
      },
    ];
  }, []);

  return analyzedRepos;
}

function createNotesRoot(dependency: any) {
  const notes = [];

  if (!dependency.isCorrect)  {
    const depsNotUpdated = (dependency.dependencies || []).filter((d: any) => !d.needsToUpdateDeps);
    if (depsNotUpdated.length === 0) return '';
    notes.unshift(...depsNotUpdated.map((d: any) => d.notes));
  }

  return notes;
}

function createNotes(dependency: any) {
  if (dependency.isCorrect) return '';
  const depsNotUpdated = (dependency.dependencies || []).filter((d: any) => !d.isCorrect);
  
  return [`${dependency.name} missing version ${depsNotUpdated.map((d: any) => `${d.name}@${d.version}`).join(', ')}`];
}