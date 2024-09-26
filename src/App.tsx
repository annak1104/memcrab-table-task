import React from 'react';
import { MatrixProvider } from './context/MatrixContext.tsx';
import Table from './components/Table.tsx';

const App: React.FC = () => {
  return (
    <MatrixProvider>
      <div>
        <h1>Matrix Table</h1>
        <Table />
      </div>
    </MatrixProvider>
  );
};

export default App;
