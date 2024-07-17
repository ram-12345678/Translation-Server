import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/Home";
import RoomPage from "./Components/Room";
import ListenerRoomPage from "./Components/ListenerRoom";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/listenerRoom/:roomId" element={<ListenerRoomPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;