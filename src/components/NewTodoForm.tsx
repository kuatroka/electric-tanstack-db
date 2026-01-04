import { useState, useEffect } from "react";
import { todosCollection, projectsCollection } from "../lib/collections";
import type { Project } from "../lib/collections";

export function NewTodoForm() {
    const [text, setText] = useState("");
    const [projectId, setProjectId] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Subscribe to projects to populate the selector
        const unsubscribe = projectsCollection.subscribeChanges((_changes) => {
            const allProjects = projectsCollection.toArray;
            setProjects(allProjects);
            if (allProjects.length > 0 && !projectId) {
                setProjectId(allProjects[0].id);
            }
        });

        // Initial load
        setProjects(projectsCollection.toArray);
        if (projectsCollection.toArray.length > 0 && !projectId) {
            setProjectId(projectsCollection.toArray[0].id);
        }

        return unsubscribe;
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !projectId) return;

        setIsSubmitting(true);
        try {
            todosCollection.insert({
                id: crypto.randomUUID(),
                text: text.trim(),
                completed: false,
                user_id: "user-1",
                project_id: projectId,
                user_ids: [],
                created_at: new Date().toISOString(),
            });
            setText("");
        } catch (err) {
            console.error("Failed to create todo:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (projects.length === 0) {
        return (
            <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px dashed #ccc", borderRadius: "8px", color: "#666" }}>
                <p>Create a project first to add todos!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #eee", borderRadius: "8px" }}>
            <h3>Add New Todo</h3>
            <div style={{ marginBottom: "1rem" }}>
                <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    disabled={isSubmitting}
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", boxSizing: "border-box" }}
                    required
                >
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            To: {p.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isSubmitting}
                    style={{ width: "100%", padding: "0.5rem", boxSizing: "border-box" }}
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting || !text.trim() || !projectId}
                style={{
                    padding: "0.5rem 1rem",
                    background: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                {isSubmitting ? "Adding..." : "Add Todo"}
            </button>
        </form>
    );
}
