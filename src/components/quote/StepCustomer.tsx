import { useState } from "react";
import { CustomerDetails } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { getJobDetails, extractCustomerDetails } from "@/lib/servicem8";

interface Props {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
  onSM8JobLoad?: (jobId: string, jobDetails: string) => void;
}

export function StepCustomer({ data, onChange, onSM8JobLoad }: Props) {
  const [sm8JobId, setSM8JobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadedJobId, setLoadedJobId] = useState("");

  const update = (field: keyof CustomerDetails, value: string) =>
    onChange({ ...data, [field]: value });

  const handleLoadJob = async () => {
    if (!sm8JobId.trim()) {
      setError("Please enter a job number");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const job = await getJobDetails(sm8JobId);
      const customerData = extractCustomerDetails(job);

      // Auto-populate customer fields
      onChange(customerData);

      // Store the job ID and details
      if (onSM8JobLoad) {
        const jobDescription = job.description || "No description provided";
        onSM8JobLoad(sm8JobId, jobDescription);
      }

      setLoadedJobId(sm8JobId);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load job details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLoadJob();
    }
  };

  return (
    <div className="space-y-4 animate-slide-in">
      {/* SM8 Job Number Lookup Section */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
        <div>
          <Label htmlFor="sm8JobId" className="text-xs font-medium">
            SM8 Job Number
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="sm8JobId"
              placeholder="e.g., J-2026-001234"
              value={sm8JobId}
              onChange={(e) => setSM8JobId(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleLoadJob}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load Job"
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>✓ Job details loaded successfully!</p>
          </div>
        )}

        {/* Loaded Job Info */}
        {loadedJobId && (
          <div className="p-2 bg-blue-100 rounded text-sm">
            <p className="font-medium text-blue-900">
              Loaded: {loadedJobId}
            </p>
            {data.firstName && data.lastName && (
              <p className="text-blue-800">
                Customer: {data.firstName} {data.lastName}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Customer Details Section */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
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
