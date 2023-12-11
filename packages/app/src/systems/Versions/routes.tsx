import { Route } from 'react-router-dom';
import { Pages } from '~/types';

import { Version } from './pages/Version';

export const versionRoutes = (
  <>
    <Route path={Pages.version} element={<Version />} />
  </>
);
