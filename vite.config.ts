import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function sm8ApiPlugin(): Plugin {
  const SM8_TOKEN = "smk-a5f784-21bf3b7b4b868ff6-54fbf7018be798d3";
  const SM8_BASE = "https://api.servicem8.com/api_1.0";

  return {
    name: "sm8-api-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || "", `http://${req.headers.host}`);

        if (url.pathname === "/api/servicem8/search-clients") {
          const q = url.searchParams.get("q");
          const isAll = q === "*";
          if (!isAll && (!q || q.trim().length < 2)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Search query must be at least 2 characters" }));
            return;
          }
          try {
            const sm8Res = await fetch(`${SM8_BASE}/company.json`, {
              headers: { Authorization: `Bearer ${SM8_TOKEN}` },
            });
            if (!sm8Res.ok) {
              res.statusCode = sm8Res.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `SM8 error: ${sm8Res.statusText}` }));
              return;
            }
            const companies = await sm8Res.json() as any[];
            const term = q.trim().toLowerCase();
            const filtered = companies
              .filter((c) => {
                const name = (c.name || "").toLowerCase();
                const email = (c.email || "").toLowerCase();
                const phone = (c.phone || c.mobile || "").toLowerCase();
                return name.includes(term) || email.includes(term) || phone.includes(term);
              })
              .slice(0, 15)
              .map((c) => ({
                uuid: c.uuid,
                name: c.name || "",
                email: c.email || "",
                phone: c.phone || c.mobile || "",
                address: [c.address, c.address_city, c.address_postcode].filter(Boolean).join(", "),
              }));
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ results: filtered }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to search clients" }));
          }
          return;
        }

        if (url.pathname === "/api/servicem8/client-jobs") {
          const companyUuid = url.searchParams.get("company_uuid");
          if (!companyUuid) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "company_uuid required" }));
            return;
          }
          try {
            const sm8Res = await fetch(
              `${SM8_BASE}/job.json?%24filter=company_uuid%20eq%20'${encodeURIComponent(companyUuid)}'`,
              { headers: { Authorization: `Bearer ${SM8_TOKEN}` } }
            );
            if (!sm8Res.ok) {
              res.statusCode = sm8Res.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `SM8 error: ${sm8Res.statusText}` }));
              return;
            }
            const jobs = await sm8Res.json() as any[];
            const mapped = jobs
              .map((j) => ({
                uuid: j.uuid,
                jobNumber: j.generated_job_id || j.uuid.slice(0, 8),
                description: j.job_description || "",
                status: j.status || "",
                date: j.date || "",
                address: [j.job_address, j.job_city, j.job_postcode].filter(Boolean).join(", "),
              }))
              .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
              .slice(0, 25);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ results: mapped }));
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to fetch jobs" }));
          }
          return;
        }

        if (url.pathname === "/api/servicem8/job") {
          const id = url.searchParams.get("id");
          if (!id) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Job ID required" }));
            return;
          }
          try {
            const sm8Res = await fetch(`${SM8_BASE}/job/${id}.json`, {
              headers: { Authorization: `Bearer ${SM8_TOKEN}` },
            });
            if (!sm8Res.ok) {
              res.statusCode = sm8Res.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: sm8Res.status === 404 ? "Job not found" : `SM8 error` }));
              return;
            }
            const data = await sm8Res.json();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to fetch job" }));
          }
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), sm8ApiPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
