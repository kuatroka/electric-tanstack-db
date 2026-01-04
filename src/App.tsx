import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ProjectList } from "./components/ProjectList";
import { TodoList } from "./components/TodoList";
import { NewProjectForm } from "./components/NewProjectForm";
import { NewTodoForm } from "./components/NewTodoForm";
import { GlobalSearch } from "./components/GlobalSearch";
import { DetailPage } from "./pages/DetailPage";

function HomePage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "800px", margin: "0 auto", paddingTop: "80px" }}>
      <h1>Electric + TanStack DB</h1>
      <p>Local-first sync with Electric SQL and TanStack DB</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
        <section>
          <NewProjectForm />
          <ProjectList />
        </section>
        <section>
          <NewTodoForm />
          <TodoList />
        </section>
      </div>

      <section style={{ marginTop: "3rem", padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
        <h3>Status</h3>
        <ul style={{ margin: 0 }}>
          <li>Electric sync: <code>localhost:30000</code></li>
          <li>App server: <code>localhost:5174</code></li>
          <li>HTTPS proxy: <code>localhost:5173</code></li>
        </ul>
      </section>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isPaddingNeeded =
    location.pathname === "/" ||
    location.pathname.startsWith("/category");

  return (
    <>
      <GlobalSearch />
      <div style={isPaddingNeeded ? { paddingTop: "80px" } : {}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:code/:cusip" element={<DetailPage />} />
          <Route path="/category/:code" element={<DetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
