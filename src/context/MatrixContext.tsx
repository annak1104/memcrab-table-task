import React, { createContext, useState } from 'react';

type CellId = number;
type CellValue = number;

type Cell = {
  id: CellId;
  amount: CellValue;
};

type MatrixContextType = {
  matrix: Cell[][];
  updateCell: (rowIndex: number, colIndex: number) => void;
  addRow: () => void;
  removeRow: (rowIndex: number) => void;
};

export const MatrixContext = createContext<MatrixContextType | undefined>(
  undefined
);

export const MatrixProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [matrix, setMatrix] = useState<Cell[][]>(() => {
    const initialMatrix: Cell[][] = [];
    for (let i = 0; i < 5; i++) {
      initialMatrix.push(
        Array.from({ length: 5 }, (_, j) => ({
          id: i * 5 + j,
          amount: Math.floor(Math.random() * 900) + 100,
        }))
      );
    }
    return initialMatrix;
  });

  const updateCell = (rowIndex: number, colIndex: number) => {
    setMatrix((prevMatrix) =>
      prevMatrix.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          rIndex === rowIndex && cIndex === colIndex
            ? { ...cell, amount: cell.amount + 1 }
            : cell
        )
      )
    );
  };

  const addRow = () => {
    const newRow = Array.from({ length: matrix[0].length }, (_, j) => ({
      id: matrix.length * matrix[0].length + j,
      amount: Math.floor(Math.random() * 900) + 100,
    }));
    setMatrix((prevMatrix) => [...prevMatrix, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    setMatrix((prevMatrix) =>
      prevMatrix.filter((_, rIndex) => rIndex !== rowIndex)
    );
  };

  return (
    <MatrixContext.Provider value={{ matrix, updateCell, addRow, removeRow }}>
      {children}
    </MatrixContext.Provider>
  );
};
