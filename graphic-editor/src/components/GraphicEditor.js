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
  const [text, setText] = useState(""); // For adding text
  const [fontSize, setFontSize] = useState(20); // Font size for text

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
      case 'ellipse':
        drawEllipse(x, y);
        break;
      case 'circle':
        drawCircle(x, y);
        break;
      case 'line':
        drawLine(x, y);
        break;
      case 'polygon':
        drawPolygon(x, y);
        break;
      case 'text':
        drawText(x, y);
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

  const drawEllipse = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = lineWidth;
    const width = x - startPoint.x;
    const height = y - startPoint.y;
    ctx.beginPath();
    ctx.ellipse(startPoint.x, startPoint.y, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
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

  const drawPolygon = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    const sides = 6; // For example, hexagon. You can modify this to be dynamic.
    const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
    const angleStep = (2 * Math.PI) / sides;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep;
      const xCoord = startPoint.x + radius * Math.cos(angle);
      const yCoord = startPoint.y + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(xCoord, yCoord);
      } else {
        ctx.lineTo(xCoord, yCoord);
      }
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawText = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = selectedColor;
    ctx.font = `${fontSize}px Arial`; // Set font size dynamically
    ctx.fillText(text, x, y);
  };

  const saveShape = () => {
    const width = mousePosition.x - startPoint.x;
    const height = mousePosition.y - startPoint.y;
    setShapes([
      ...shapes,
      {
        type: tool,
        startPoint,
        width: Math.abs(width),
        height: Math.abs(height),
        radius: tool === 'circle' ? Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) : undefined,
        color: selectedColor,
        lineWidth,
        text,
        fontSize, // Save font size
      },
    ]);
  };

  const redrawShapes = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    shapes.forEach((shape) => {
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.lineWidth;
      switch (shape.type) {
        case 'rectangle':
          ctx.strokeRect(
            shape.startPoint.x,
            shape.startPoint.y,
            shape.width,
            shape.height
          );
          break;
        case 'ellipse':
          ctx.beginPath();
          ctx.ellipse(shape.startPoint.x, shape.startPoint.y, shape.width / 2, shape.height / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(shape.startPoint.x, shape.startPoint.y, shape.radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'line':
          ctx.beginPath();
          ctx.moveTo(shape.startPoint.x, shape.startPoint.y);
          ctx.lineTo(shape.startPoint.x + shape.width, shape.startPoint.y + shape.height);
          ctx.stroke();
          break;
        case 'polygon':
          const sides = 6; // Example for hexagon.
          const radius = shape.width; // Using width as radius
          const angleStep = (2 * Math.PI) / sides;
          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const angle = i * angleStep;
            const xCoord = shape.startPoint.x + radius * Math.cos(angle);
            const yCoord = shape.startPoint.y + radius * Math.sin(angle);
            if (i === 0) {
              ctx.moveTo(xCoord, yCoord);
            } else {
              ctx.lineTo(xCoord, yCoord);
            }
          }
          ctx.closePath();
          ctx.stroke();
          break;
        case 'text':
          ctx.font = `${shape.fontSize}px Arial`; // Use saved font size
          ctx.fillText(shape.text, shape.startPoint.x, shape.startPoint.y);
          break;
        default:
          break;
      }
    });
  };

  const selectShape = (x, y) => {
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (isPointInShape(x, y, shape)) {
        setSelectedShapeIndex(i);
        return i;
      }
    }
    setSelectedShapeIndex(null);
    return -1;
  };

  const isPointInShape = (x, y, shape) => {
    const left = Math.min(shape.startPoint.x, shape.startPoint.x + shape.width);
    const right = Math.max(shape.startPoint.x, shape.startPoint.x + shape.width);
    const top = Math.min(shape.startPoint.y, shape.startPoint.y + shape.height);
    const bottom = Math.max(shape.startPoint.y, shape.startPoint.y + shape.height);
    return x >= left && x <= right && y >= top && y <= bottom;
  };

  const moveShape = (x, y) => {
    const updatedShapes = [...shapes];
    const shape = updatedShapes[selectedShapeIndex];
    const newStartPoint = { x: x - offset.x, y: y - offset.y };

    // Update only the start position, keeping the size fixed
    shape.startPoint = newStartPoint;
    setShapes(updatedShapes);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid black' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div>
        <button onClick={() => setTool('rectangle')}>Rectangle</button>
        <button onClick={() => setTool('ellipse')}>Ellipse</button>
        <button onClick={() => setTool('circle')}>Circle</button>
        <button onClick={() => setTool('line')}>Line</button>
        <button onClick={() => setTool('polygon')}>Polygon</button>
        <button onClick={() => setTool('text')}>Text</button>
        <button onClick={() => setTool('select')}>Select</button>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
        <input
          type="number"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />
        <input
          type="range"
          min="10"
          max="100"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        {tool === 'text' && (
          <>
            <input
              type="text"
              placeholder="Enter text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              placeholder="Font size"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GraphicEditor;
