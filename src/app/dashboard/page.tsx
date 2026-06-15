"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Folder, Trash2, ArrowRight, Loader2 } from "lucide-react";

type Project = { id: string; name: string; updated_at: string };
type User = { id: string; email: string; displayName?: string };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (!data.user) {
          router.replace("/login");
          return;
        }
        setUser(data.user);
      } catch (error) {
        console.error(error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Untitled Website" }),
      });
      const data = await res.json();
      if (data.project?.id) {
        router.push(`/editor/${data.project.id}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loadingWrap"><Loader2 className="spinner" size={32} /></div>;
  if (!user) return null;

  return (
    <div className="dashboardWrap">
      <div className="topbar">
        <div className="brand" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: "800" }}>
          <span className="dot" aria-hidden="true" />
          Buildify
        </div>
        <div className="topActions" style={{ gap: "24px", display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
            Welcome, <b style={{ color: "#fff" }}>{user.displayName || user.email}</b>
          </span>
          <button
            className="iconBtn danger"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/");
            }}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboardContent">
        <div className="dashboardHeader">
          <h2 style={{ fontSize: "28px", fontWeight: "600" }}>My Projects</h2>
          <button
            className="createBtn"
            onClick={handleCreateProject}
            style={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              color: "#ffffff",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.3)";
            }}
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        <div className="projectsGrid">
          {projects.length === 0 ? (
            <div className="emptyState">
              <Folder size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
              <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>No projects yet.</p>
              <button
                className="createBtn"
                onClick={handleCreateProject}
                style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  color: "#ffffff",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.3)";
                }}
              >
                Create your first project
              </button>
            </div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="projectCard">
                <div className="projectInfo">
                  <h3 style={{ fontSize: "18px", marginBottom: "8px", fontWeight: "500" }}>{p.name}</h3>
                  <span className="date" style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                    Updated {new Date(p.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="projectActions">
                  <button
                    className="iconBtn"
                    onClick={() => router.push(`/editor/${p.id}`)}
                    title="Open Project"
                    style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}
                  >
                    <ArrowRight size={16} />
                  </button>
                  <button className="iconBtn danger" onClick={() => handleDelete(p.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
