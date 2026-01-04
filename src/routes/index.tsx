import { createFileRoute } from "@tanstack/react-router";
import { ProjectList } from "../components/ProjectList";
import { TodoList } from "../components/TodoList";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Electric + TanStack DB</h1>
      <p>Local-first sync with Electric SQL and TanStack DB</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
        <section>
          <ProjectList />
        </section>
        <section>
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
