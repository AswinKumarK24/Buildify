"use client";

import { useEffect, useState } from "react";
import { Rocket, Globe, Loader2, CheckCircle2, ChevronRight, AlertCircle, Key } from "lucide-react";

export function DeployModal({
  open,
  onClose,
  html,
  css,
  js,
  pageName
}: {
  open: boolean;
  onClose: () => void;
  html: string;
  css: string;
  js: string;
  pageName: string;
}) {
  const [token, setToken] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const savedToken = window.localStorage.getItem("buildify_vercel_token");
      if (savedToken) setToken(savedToken);
      setDeploying(false);
      setDeployUrl(null);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const handleDeploy = async () => {
    if (!token.trim()) {
      setError("Please provide a valid Vercel API token.");
      return;
    }

    try {
      window.localStorage.setItem("buildify_vercel_token", token.trim());
      setDeploying(true);
      setError(null);
      
      const projectName = (pageName || "buildify-project").toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 30);

      const payload = {
        name: projectName || "buildify-project",
        files: [
          { file: "index.html", data: html },
          { file: "styles.css", data: css },
          { file: "script.js", data: js }
        ],
        projectSettings: {
          framework: null
        }
      };

      const res = await fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Deployment failed. Check your API token.");
      }

      setDeployUrl(`https://${data.url}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during deployment.");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="previewOverlay show" role="dialog" aria-modal="true" aria-label="Deploy to Web" onMouseDown={(e) => (e.currentTarget === e.target && !deploying ? onClose() : null)}>
      <div className="deployModalCard">
        <div className="dTop">
          <div className="hRow">
            <span className="iconBlock"><Rocket size={16} /></span>
            <div className="dTitle">Publish to Vercel</div>
          </div>
          {!deploying && <button className="closeBtn" onClick={onClose}>Close</button>}
        </div>

        <div className="dBody">
          {deployUrl ? (
            <div className="successState">
              <CheckCircle2 size={48} color="#27c93f" />
              <h3>Deployment Successful!</h3>
              <p>Your website is now universally accessible on the internet.</p>
              <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="liveLink">
                <Globe size={16} />
                <span>{deployUrl}</span>
              </a>
              <button className="btn btnSecondary" style={{ marginTop: 24 }} onClick={onClose}>Return to Editor</button>
            </div>
          ) : (
            <div className="setupState">
              <p className="dText">We securely use the Vercel REST API to deploy your raw static files directly from this browser to a live global URL.</p>
              
              <div className="tokenField">
                <label>
                  <Key size={14} /> Vercel API Token
                </label>
                <div style={{ position: "relative" }}>
                  <input 
                    type="password" 
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your token (e.g., Lxyz...)" 
                    disabled={deploying}
                    className="tokenInput"
                  />
                  <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="tokenHelp">Get Token</a>
                </div>
              </div>

              {error && (
                <div className="errorBox">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button className="btn btnPrimary dBtn" onClick={handleDeploy} disabled={deploying || !token.trim()}>
                {deploying ? (
                  <><Loader2 className="spinner" size={16} /> Deploying globally...</>
                ) : (
                  <>Deploy Now <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
