import { useState } from "react";
import { projectsCollection } from "../lib/collections";

export function NewProjectForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            projectsCollection.insert({
                id: crypto.randomUUID(),
                name: name.trim(),
                description: description.trim() || null,
                owner_id: "user-1", // Placeholder
                shared_user_ids: [],
                created_at: new Date().toISOString(),
            });
            setName("");
            setDescription("");
        } catch (err) {
            console.error("Failed to create project:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #eee", borderRadius: "8px" }}>
            <h3>Create New Project</h3>
            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", boxSizing: "border-box" }}
                    required
                />
                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    style={{ width: "100%", padding: "0.5rem", minHeight: "60px", boxSizing: "border-box" }}
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                style={{
                    padding: "0.5rem 1rem",
                    background: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                {isSubmitting ? "Creating..." : "Create Project"}
            </button>
        </form>
    );
}
