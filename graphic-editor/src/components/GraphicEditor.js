import React, { useRef, useState, useEffect } from 'react';

const GraphicEditor = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('rectangle');
  const [shapes, setShapes] = useState([]);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [lineWidth, setLineWidth] = useState(2);
  const [size, setSize] = useState(50); // Default size for resizing shapes

  useEffect(() => {
    redrawShapes();
  }, [shapes, selectedShapeIndex]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e);
    if (tool === 'select') {
      const index = selectShape(x, y);
      if (index !== -1) {
        setIsMoving(true);
        const shape = shapes[index];
        setOffset({ x: x - shape.startPoint.x, y: y - shape.startPoint.y });
        setSelectedShapeIndex(index);
        return;
      }
    }
    setIsDrawing(true);
    setStartPoint({ x, y });
    setMousePosition({ x, y });
  };

  const handleMouseMove = (e) => {
    const { x, y } = getMousePos(e);
    if (isMoving && selectedShapeIndex !== null) {
      moveShape(x, y);
      return;
    }
    if (!isDrawing) return;
    setMousePosition({ x, y });
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    redrawShapes();
    switch (tool) {
      case 'rectangle':
        drawRect(x, y);
        break;
      case 'circle':
        drawCircle(x, y);
        break;
      case 'line':
        drawLine(x, y);
        break;
      default:
        break;
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) saveShape();
    setIsDrawing(false);
    setIsMoving(false);
  };

  const drawRect = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
  };

  const drawCircle = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = lineWidth;
    const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawLine = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const saveShape = () => {
    setShapes([...shapes, { type: tool, startPoint, endPoint: mousePosition, color: selectedColor, lineWidth, size }]);
  };

  const redrawShapes = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    shapes.forEach(shape => {
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.lineWidth;
      switch (shape.type) {
        case 'rectangle':
          ctx.strokeRect(
            shape.startPoint.x,
            shape.startPoint.y,
            shape.endPoint.x - shape.startPoint.x,
            shape.endPoint.y - shape.startPoint.y
          );
          break;
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(shape.endPoint.x - shape.startPoint.x, 2) + Math.pow(shape.endPoint.y - shape.startPoint.y, 2)
          );
          ctx.beginPath();
          ctx.arc(shape.startPoint.x, shape.startPoint.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'line':
          ctx.beginPath();
          ctx.moveTo(shape.startPoint.x, shape.startPoint.y);
          ctx.lineTo(shape.endPoint.x, shape.endPoint.y);
          ctx.stroke();
          break;
        default:
          break;
      }
    });
  };

  const selectShape = (x, y) => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (
        shape.type === 'rectangle' &&
        x >= shape.startPoint.x &&
        x <= shape.endPoint.x &&
        y >= shape.startPoint.y &&
        y <= shape.endPoint.y
      ) {
        return i;
      }
      if (shape.type === 'circle') {
        const dx = x - shape.startPoint.x;
        const dy = y - shape.startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = Math.sqrt(
          Math.pow(shape.endPoint.x - shape.startPoint.x, 2) + Math.pow(shape.endPoint.y - shape.startPoint.y, 2)
        );
        if (distance <= radius) {
          return i;
        }
      }
      if (shape.type === 'line') {
        const distance = Math.abs(
          (shape.endPoint.y - shape.startPoint.y) * x -
            (shape.endPoint.x - shape.startPoint.x) * y +
            shape.endPoint.x * shape.startPoint.y -
            shape.endPoint.y * shape.startPoint.x
        ) /
          Math.sqrt(
            Math.pow(shape.endPoint.y - shape.startPoint.y, 2) + Math.pow(shape.endPoint.x - shape.startPoint.x, 2)
          );
        if (distance <= lineWidth) {
          return i;
        }
      }
    }
    return -1;
  };

  const moveShape = (x, y) => {
    const newShapes = [...shapes];
    const shape = newShapes[selectedShapeIndex];
    const deltaX = x - offset.x;
    const deltaY = y - offset.y;
    // Move shape freely without changing its size
    const deltaWidth = shape.endPoint.x - shape.startPoint.x;
    const deltaHeight = shape.endPoint.y - shape.startPoint.y;
    shape.startPoint = { x: deltaX, y: deltaY };
    shape.endPoint = { x: deltaX + deltaWidth, y: deltaY + deltaHeight };
    setShapes(newShapes);
  };

  const handleResizeChange = (e) => {
    setSize(Number(e.target.value));
    if (selectedShapeIndex !== null) {
      const newShapes = [...shapes];
      const shape = newShapes[selectedShapeIndex];
      if (shape.type === 'rectangle') {
        shape.endPoint = { x: shape.startPoint.x + size, y: shape.startPoint.y + size };
      } else if (shape.type === 'circle') {
        shape.endPoint = { x: shape.startPoint.x + size, y: shape.startPoint.y + size };
      }
      setShapes(newShapes);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black' }}
      />
      <div>
        <button onClick={() => setTool('rectangle')}>Rectangle</button>
        <button onClick={() => setTool('circle')}>Circle</button>
        <button onClick={() => setTool('line')}>Line</button>
        <button onClick={() => setTool('select')}>Select/Move</button>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
        <input
          type="number"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
        />
        <div>
          <label>Resize Shape: </label>
          <input
            type="range"
            value={size}
            onChange={handleResizeChange}
            min="10"
            max="200"
          />
        </div>
      </div>
    </div>
  );
};

export default GraphicEditor;
