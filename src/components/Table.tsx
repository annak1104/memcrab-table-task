import React, { useState } from 'react';
import { useMatrix } from '../hooks/useMatrix.ts';
import { Delete } from '../icons/Delete.tsx';

const Table: React.FC = () => {
  const { matrix, updateCell, addRow, removeRow } = useMatrix();
  const [nearestCells, setNearestCells] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const X = 5;

  const calculateRowSum = (row: { id: number; amount: number }[]) =>
    row.reduce((sum, cell) => sum + cell.amount, 0);

  const calculateColumnSum = (colIndex: number) =>
    matrix.reduce((sum, row) => sum + row[colIndex].amount, 0);

  const calculateFiftyPercentOfColumnSum = (colIndex: number) => {
    const columnSum = calculateColumnSum(colIndex);
    return columnSum * 0.5;
  };

  const calculateCellPercentage = (amount: number, rowSum: number) =>
    rowSum === 0 ? 0 : (amount / rowSum) * 100;

  const calculateMaxValueInRow = (row: { id: number; amount: number }[]) =>
    Math.max(...row.map((cell) => cell.amount));

  const findNearestCells = (rowIndex: number, colIndex: number) => {
    const targetValue = matrix[rowIndex][colIndex].amount;
    const allCells = matrix
      .flat()
      .map((cell) => ({ ...cell, diff: Math.abs(cell.amount - targetValue) }));
    allCells.sort((a, b) => a.diff - b.diff);

    const nearest = allCells.slice(1, X + 1).map((cell) => cell.id);
    setNearestCells(nearest);
  };

  const handleCellHover = (rowIndex: number, colIndex: number) => {
    findNearestCells(rowIndex, colIndex);
  };

  const handleRowSumHover = (rowIndex: number) => {
    setHoveredRow(rowIndex);
  };

  const resetHover = () => {
    setNearestCells([]);
    setHoveredRow(null);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {Array.from({ length: matrix[0].length }, (_, colIndex) => (
              <th key={colIndex}>Column {colIndex + 1}</th>
            ))}
            <th>Sum</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => {
            const rowSum = calculateRowSum(row);
            const maxRowValue = calculateMaxValueInRow(row);

            return (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isNearest = nearestCells.includes(cell.id);
                  const percentage = calculateCellPercentage(
                    cell.amount,
                    rowSum
                  );
                  const heatmapIntensity = (cell.amount / maxRowValue) * 100;

                  return (
                    <td
                      key={cell.id}
                      style={{
                        backgroundColor:
                          hoveredRow === rowIndex
                            ? `rgba(0, 123, 255, ${heatmapIntensity / 100})`
                            : isNearest
                              ? 'lightgreen'
                              : '',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                      onMouseLeave={resetHover}
                      onClick={() => {
                        updateCell(rowIndex, colIndex);
                      }}
                    >
                      {hoveredRow === rowIndex
                        ? `${percentage.toFixed(1)}%`
                        : cell.amount}
                    </td>
                  );
                })}
                <td
                  onMouseEnter={() => handleRowSumHover(rowIndex)}
                  onMouseLeave={resetHover}
                  style={{ cursor: 'pointer' }}
                >
                  {rowSum}
                </td>
                <td>
                  <button onClick={() => removeRow(rowIndex)}>
                    <Delete />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            {Array.from({ length: matrix[0].length }, (_, colIndex) => (
              <td key={colIndex}>
                {calculateFiftyPercentOfColumnSum(colIndex)}
              </td>
            ))}
            <td>50% of Column Sum</td>
          </tr>
        </tfoot>
      </table>
      <button onClick={addRow}>Add Row</button>
    </div>
  );
};

export default Table;
