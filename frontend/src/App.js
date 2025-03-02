import LoginScr from "./screens/LoginScr.js";
import Layout from "./screens/Layout.js";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginScr />} />
      </Route>
    </Routes>
  );
}

export default App;
