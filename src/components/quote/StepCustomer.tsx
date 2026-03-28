import { useState, useEffect, useRef } from "react";
import { CustomerDetails } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Search, Loader2, User, X, Briefcase, CheckCircle2, ChevronDown } from "lucide-react";

interface SM8Client {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface SM8Job {
  uuid: string;
  jobNumber: string;
  description: string;
  status: string;
  date: string;
  address: string;
}

interface Props {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
}

export function StepCustomer({ data, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [allClients, setAllClients] = useState<SM8Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [jobs, setJobs] = useState<SM8Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load all clients on first open
  const loadClients = async () => {
    if (initialLoaded) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/servicem8/search-clients?q=*`);
      if (res.ok) {
        const d = await res.json();
        setAllClients(d.results || []);
      }
    } catch {
      setAllClients([]);
    } finally {
      setLoading(false);
      setInitialLoaded(true);
    }
  };

  // Also search when query changes (for server-side filtering)
  useEffect(() => {
    if (!open || query.length < 2) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/servicem8/search-clients?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const d = await res.json();
          setAllClients(d.results || []);
        }
      } catch {
        // keep existing
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, open]);

  // Fetch jobs when client is selected
  useEffect(() => {
    if (!data.sm8ClientId) {
      setJobs([]);
      return;
    }

    let cancelled = false;
    setJobsLoading(true);

    fetch(`/api/servicem8/client-jobs?company_uuid=${encodeURIComponent(data.sm8ClientId)}`)
      .then((res) => res.ok ? res.json() : { results: [] })
      .then((d) => { if (!cancelled) setJobs(d.results || []); })
      .catch(() => { if (!cancelled) setJobs([]); })
      .finally(() => { if (!cancelled) setJobsLoading(false); });

    return () => { cancelled = true; };
  }, [data.sm8ClientId]);

  // Client-side filter
  const filtered = query.length >= 2
    ? allClients
    : allClients;

  const handleOpen = () => {
    setOpen(true);
    loadClients();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const selectClient = (client: SM8Client) => {
    onChange({
      ...data,
      sm8ClientId: client.uuid,
      clientName: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      linkedJobUuid: undefined,
      linkedJobNumber: undefined,
      linkedJobDescription: undefined,
    });
    setQuery("");
    setOpen(false);
  };

  const clearClient = () => {
    onChange({
      jobNumber: "",
      sm8ClientId: undefined,
      clientName: "",
      email: "",
      phone: "",
      address: "",
      linkedJobUuid: undefined,
      linkedJobNumber: undefined,
      linkedJobDescription: undefined,
    });
    setJobs([]);
    setQuery("");
  };

  const linkJob = (job: SM8Job) => {
    onChange({
      ...data,
      linkedJobUuid: job.uuid,
      linkedJobNumber: job.jobNumber,
      linkedJobDescription: job.description,
      jobNumber: job.jobNumber,
      address: job.address || data.address,
    });
  };

  const unlinkJob = () => {
    onChange({
      ...data,
      linkedJobUuid: undefined,
      linkedJobNumber: undefined,
      linkedJobDescription: undefined,
      jobNumber: "",
    });
  };

  const hasClient = !!data.clientName;

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Client Search Dropdown */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border border-border">
        <h3 className="text-sm font-semibold text-foreground">ServiceM8 Client</h3>

        {hasClient ? (
          <div className="bg-muted rounded-lg p-3 flex items-start gap-3">
            <User className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{data.clientName}</p>
              {data.email && <p className="text-xs text-muted-foreground">{data.email}</p>}
              {data.phone && <p className="text-xs text-muted-foreground">{data.phone}</p>}
              {data.address && <p className="text-xs text-muted-foreground truncate">{data.address}</p>}
            </div>
            <button onClick={clearClient} className="text-muted-foreground hover:text-foreground p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div ref={wrapperRef} className="relative">
            {/* Trigger button styled like a select */}
            <button
              type="button"
              onClick={handleOpen}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="text-muted-foreground">Select a client...</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                {/* Search input inside dropdown */}
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type to search..."
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Results list */}
                <div className="max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading clients...
                    </div>
                  ) : filtered.length > 0 ? (
                    filtered.map((client) => (
                      <button
                        key={client.uuid}
                        onClick={() => selectClient(client)}
                        className="w-full text-left px-3 py-2.5 hover:bg-accent/50 border-b border-border last:border-0 transition-colors"
                      >
                        <p className="font-medium text-sm text-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[client.email, client.phone].filter(Boolean).join(" · ")}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      {query.length >= 2 ? "No clients found" : "Type at least 2 characters to search"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Jobs Section */}
      {hasClient && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border border-border">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Link to Existing Job</h3>
          </div>

          {data.linkedJobUuid ? (
            <div className="bg-primary/10 rounded-lg p-3 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">Job #{data.linkedJobNumber}</p>
                {data.linkedJobDescription && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{data.linkedJobDescription}</p>
                )}
              </div>
              <button onClick={unlinkJob} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : jobsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading jobs...
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {jobs.map((job) => (
                <button
                  key={job.uuid}
                  onClick={() => linkJob(job)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/50 transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">#{job.jobNumber}</span>
                    <span className="text-xs text-muted-foreground capitalize">{job.status}</span>
                  </div>
                  {job.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{job.description}</p>
                  )}
                  {job.date && (
                    <p className="text-xs text-muted-foreground mt-0.5">{job.date}</p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No existing jobs found for this client.</p>
          )}
        </div>
      )}
    </div>
  );
}
