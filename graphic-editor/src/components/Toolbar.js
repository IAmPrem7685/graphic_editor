// src/components/Toolbar.js
import React from 'react';

const Toolbar = ({ onAddCube }) => {
  return (
    <div style={{ padding: '10px', borderRight: '1px solid #ccc' }}>
      <h3>Toolbar</h3>
      <button onClick={onAddCube}>Add Cube</button>
      {/* Add more tools for other shapes and functionalities here */}
    </div>
  );
};

export default Toolbar;
