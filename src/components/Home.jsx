import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleCreateNewCanvas = async () => {
    try {
      const docRef = await addDoc(collection(db, "canvases"), {
        createdAt: new Date().toISOString(),
        data: null,
      });
      navigate(`/canvas/${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-6 px-8">
      <h1 className="text-5xl font-bold text-center">
        🎨 Simple 2D Canvas
      </h1>
      <p className="text-center">
        Welcome to the Simple 2D Canvas Editor! Create and edit your canvases
        with ease.
      </p>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
        onClick={handleCreateNewCanvas}
      >
        + Create New Canvas
      </button>
    </div>
  );
};

export default Home;
