import { useState, useEffect } from "react";
import { shapes } from "../lib/electric";
import type { Todo } from "../lib/collections";

interface TodoListProps {
  projectId?: string;
}

export function TodoList({ projectId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const shape = shapes.todos(projectId);

    shape.subscribe(({ rows }) => {
      setTodos(rows as Todo[]);
      setLoading(false);
    });

    return () => {
      shape.unsubscribe();
    };
  }, [projectId]);

  if (loading) {
    return <div>Loading todos...</div>;
  }

  if (todos.length === 0) {
    return (
      <div>
        <h2>Todos</h2>
        <p>No todos yet.</p>
      </div>
    );
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div>
      <h2>
        Todos ({completedCount}/{todos.length} completed)
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              padding: "0.75rem",
              marginBottom: "0.25rem",
              background: todo.completed ? "#f0fff0" : "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              readOnly
              style={{ width: "1.25rem", height: "1.25rem" }}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#888" : "inherit",
              }}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
