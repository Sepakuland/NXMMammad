import React from 'react';

export default function RowNumberGenerator(cellData) {
  return (
    <div>
        {cellData.rowIndex+1}
    </div>
  );
}