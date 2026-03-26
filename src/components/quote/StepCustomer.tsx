import { useState } from "react";
import { CustomerDetails } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getJobDetails, extractCustomerDetails } from "@/lib/servicem8";

interface Props {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
  onSM8JobLoad?: (jobId: string, jobDetails?: any) => void;
}

export function StepCustomer({ data, onChange, onSM8JobLoad }: Props) {
  const [jobNumber, setJobNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof CustomerDetails, value: string) =>
    onChange({ ...data, [field]: value });

  const handleLoadJob = async () => {
    const trimmed = jobNumber.trim();

    if (!trimmed) {
      setError("Please enter a job number");
      return;
    }

    // Accept various formats - let the API handle validation
    // Supported: 2055, #2055, J-2025-001234, J2055, etc.

    setLoading(true);
    setError("");

    try {
      const job = await getJobDetails(trimmed);
      const customerDetails = extractCustomerDetails(job);
      onChange(customerDetails);

      // IMPORTANT: Pass SM8 job ID back to parent
      if (onSM8JobLoad && job.id) {
        onSM8JobLoad(job.id, job);
      }

      setJobNumber("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Job Lookup Section */}
      <div className="bg-blue-50 rounded-lg p-4 shadow-sm space-y-3 border border-blue-200">
        <h3 className="text-sm font-semibold text-gray-700">Load from ServiceM8 Job</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="jobNumber" className="text-xs font-medium">
              Job Number
            </Label>
            <textarea
              id="jobNumber"
              value={jobNumber}
              onChange={(e) => {
                setJobNumber(e.target.value);
                setError("");
              }}
              placeholder="e.g. 2062"
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              rows={1}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleLoadJob}
              disabled={loading || !jobNumber.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors"
            >
              {loading ? "Loading..." : "Load Job"}
            </button>
          </div>
        </div>
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Customer Details Section */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Customer Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" className="text-xs font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-xs font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Smith"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email" className="text-xs font-medium">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-xs font-medium">
            Phone *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="07700 900000"
          />
        </div>
        <div>
          <Label htmlFor="address" className="text-xs font-medium">
            Address *
          </Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="123 High Street, London"
          />
        </div>
      </div>
    </div>
  );
}
// Force rebuild Thu Mar 26 05:20:41 GMT 2026
