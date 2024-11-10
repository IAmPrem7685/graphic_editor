import { drawEllipse, drawLine, drawPolygon, drawText } from './path-to-their-definitions';



export const drawShape = (type, context, startPoint, endPoint, text = '') => {
    switch (type) {
      case 'rectangle':
        drawRectangle(context, startPoint, endPoint);
        break;
      case 'circle':
        drawCircle(context, startPoint, endPoint);
        break;
      case 'ellipse':
        drawEllipse(context, startPoint, endPoint);
        break;
      case 'line':
        drawLine(context, startPoint, endPoint);
        break;
      case 'polygon':
        drawPolygon(context, startPoint, endPoint);
        break;
      case 'text':
        drawText(context, endPoint, text);
        break;
      default:
        break;
    }
  };
  
  export const drawSavedShape = ({ type, startPoint, endPoint, text }, context) => {
    drawShape(type, context, startPoint, endPoint, text);
  };
  
  const drawRectangle = (context, startPoint, endPoint) => {
    const width = endPoint.x - startPoint.x;
    const height = endPoint.y - startPoint.y;
    context.beginPath();
    context.rect(startPoint.x, startPoint.y, width, height);
    context.stroke();
    context.fill();
  };
  
  const drawCircle = (context, startPoint, endPoint) => {
    const radius = Math.abs(endPoint.x - startPoint.x);
    context.beginPath();
    context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  };
  
  // Other drawing functions (drawEllipse, drawLine, drawPolygon, drawText) can be defined similarly...
  
  export const clearCanvas = (canvasRef, setShapes) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setShapes([]);
  };
  