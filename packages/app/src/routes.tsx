import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { versionRoutes } from './systems/Versions/routes';
import { Pages } from './types';

export const routes = (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path="*" element={<Navigate to={Pages.version} />} />
        {versionRoutes}
      </Route>
    </Routes>
  </BrowserRouter>
);
