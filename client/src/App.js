import TextEditor from "./TextEditor";
import { BrowserRouter as Router, Route,Routes, Outlet, useNavigate,Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function App() {

  return (
    <Router>
      <Routes>
      <Route
        path="/"
        element={<Navigate to={`/documents/${uuidV4()}`} replace />}
      />
      <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
