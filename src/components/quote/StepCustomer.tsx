import { useState, useEffect, useRef } from "react";
import { CustomerDetails } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, User, X } from "lucide-react";

interface SM8Client {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Props {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
}

export function StepCustomer({ data, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SM8Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/servicem8/search-clients?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setShowResults(true);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectClient = (client: SM8Client) => {
    onChange({
      ...data,
      sm8ClientId: client.uuid,
      clientName: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setQuery("");
    setShowResults(false);
  };

  const clearClient = () => {
    onChange({
      jobNumber: data.jobNumber,
      sm8ClientId: undefined,
      clientName: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  const hasClient = !!data.clientName;

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Client Search */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border border-border">
        <h3 className="text-sm font-semibold text-foreground">Search ServiceM8 Client</h3>

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="pl-9 pr-9"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
              )}
            </div>

            {showResults && results.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {results.map((client) => (
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
                ))}
              </div>
            )}

            {showResults && results.length === 0 && !loading && query.length >= 2 && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg p-3 text-center text-sm text-muted-foreground">
                No clients found
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
