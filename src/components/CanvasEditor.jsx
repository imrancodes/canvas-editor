import { Circle, PenTool, RectangleHorizontal, Trash, Type } from "lucide-react";
import { fabric } from "fabric-pure-browser";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const { id } = useParams();

  useEffect(() => {
    const initCanvas = new fabric.Canvas("fabric-canvas", {
      backgroundColor: "#fff",
      selection: true,
    });
    setCanvas(initCanvas);

    initCanvas.setHeight(canvasRef.current.clientHeight);
    initCanvas.setWidth(canvasRef.current.clientWidth);

    return () => {
      try {
        if (!initCanvas._disposed) initCanvas.dispose();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;
    const canvasLoad = async () => {
      const ref = doc(db, "canvases", id);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().data) {
        canvas.loadFromJSON(JSON.parse(snap.data().data), () => canvas.renderAll());
      }
    };
    canvasLoad();
  }, [id, canvas]);

  const canvasSave = async () => {
    const ref = doc(db, "canvases", id);
    await setDoc(ref, {
      data: JSON.stringify(canvas.toJSON()),
      updatedAt: new Date().toISOString(),
    });
    alert("Canvas saved!");
  };

  const addRectangle = () => {
    canvas.add(
      new fabric.Rect({
        left: 100,
        top: 100,
        width: 120,
        height: 80,
        fill: selectedColor,
      })
    );
  };

  const addCircle = () => {
    canvas.add(
      new fabric.Circle({
        left: 150,
        top: 150,
        radius: 50,
        fill: selectedColor,
      })
    );
  };

  const addText = () => {
    canvas.add(
      new fabric.IText("Edit me", {
        left: 200,
        top: 200,
        fill: selectedColor,
        fontSize: 24,
      })
    );
  };

  const enablePen = () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = 3;
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    const active = canvas.getActiveObject();
    if (active) active.set("fill", color);
    canvas.freeDrawingBrush.color = color;
    canvas.renderAll();
  };

  const deleteObject = () => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects.length) return;

    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="text-center py-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold">🎨 Canvas Editor</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-100 text-black p-4 flex flex-col gap-4">
          <h2 className="font-semibold text-lg mb-2">Tools</h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={addRectangle}
              className="bg-white border border-gray-300 p-2 rounded hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              <RectangleHorizontal className="w-5 h-5" />
            </button>

            <button
              onClick={addCircle}
              className="bg-white border border-gray-300 p-2 rounded hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              <Circle className="w-5 h-5" />
            </button>

            <button
              onClick={addText}
              className="bg-white border border-gray-300 p-2 rounded hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              <Type className="w-5 h-5" />
            </button>

            <button
              onClick={enablePen}
              className="bg-white border border-gray-300 p-2 rounded hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              <PenTool className="w-5 h-5" />
            </button>

            <button
              onClick={deleteObject}
              className="bg-red-500 border border-gray-300 p-2 rounded hover:bg-red-600 flex items-center justify-center cursor-pointer text-white"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Color</label>
            <input
              type="color"
              className="w-full h-10 border border-gray-300 rounded mt-2 cursor-pointer"
              value={selectedColor}
              onChange={handleColorChange}
            />
          </div>

          <button
            onClick={canvasSave}
            className="mt-auto bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-medium cursor-pointer"
          >
            Save
          </button>
        </aside>

        <main
          ref={canvasRef}
          className="flex-1 bg-white relative flex items-center justify-center"
        >
          <canvas
            id="fabric-canvas"
            className="border border-gray-300 rounded shadow w-[90%] h-[90%]"
          />
        </main>
      </div>
    </div>
  );
};

export default CanvasEditor;
