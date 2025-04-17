import LoginScr from "./screens/LoginScr.js";
import DiscoverScr from "./screens/DiscoverScr.js";
import SchedulerScr from "./screens/SchedulerScr.js";
import ProfileScr from "./screens/ProfileScr.js";
import Layout from "./screens/Layout.js";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginScr />} />
        <Route path="discover" element={<DiscoverScr />} />
        <Route path="scheduler" element={<SchedulerScr />} />
        <Route path="profile" element={<ProfileScr />} />
      </Route>
    </Routes>
  );
}

export default App;
