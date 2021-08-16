import React, { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import Layout from '@theme/Layout';

import Docs from '../../components/Docs';
import Header from '../../components/Header';
import './index.css';

function App() {
  const [expandedPath, setExpandedPath] = useState();
  const [searchFilters, setSearchFilters] = useState({
    showHtml: false,
    showIOS: false,
    showAndroid: false,
  });
  return (
    <Layout>
      <div className="json-docs">
        <Header
          expandPath={(path) => setExpandedPath(path)}
          searchFilters={searchFilters}
        />
        <div className="Content">
          <Docs
            expandedPath={expandedPath}
            setSearchFilters={setSearchFilters}
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
