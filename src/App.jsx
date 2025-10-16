import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import CanvasEditor from "./components/CanvasEditor"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/canvas/:id" element={<CanvasEditor />} />
    </Routes>
  )
}

export default App