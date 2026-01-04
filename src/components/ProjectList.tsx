import { useState, useEffect } from "react";
import { shapes } from "../lib/electric";
import type { Project } from "../lib/collections";

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const shape = shapes.projects();

    shape.subscribe(({ rows }) => {
      setProjects(rows as Project[]);
      setLoading(false);
    });

    return () => {
      shape.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (projects.length === 0) {
    return (
      <div>
        <h2>Projects</h2>
        <p>No projects yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Projects ({projects.length})</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {projects.map((project) => (
          <li
            key={project.id}
            style={{
              padding: "1rem",
              marginBottom: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <strong>{project.name}</strong>
            {project.description && (
              <p style={{ margin: "0.5rem 0 0", color: "#666" }}>
                {project.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
