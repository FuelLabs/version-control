import type { ReactNode } from 'react';

import { FuelUiProvider } from './systems/Settings/providers/FuelUiProvider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <FuelUiProvider>{children}</FuelUiProvider>;
}
