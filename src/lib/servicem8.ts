export interface SM8Job {
  id: string;
  client_id?: string;
  client?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
  };
  address?: string;
  description?: string;
  status?: string;
}

export interface ServiceM8Response {
  response?: SM8Job;
  error?: string;
}

export async function getJobDetails(jobId: string): Promise<SM8Job> {
  // Accept various formats and clean them up:
  // - 2055 (just number)
  // - #2055 (with hash)
  // - J-2025-001234 (SM8 standard)
  // - J2055 (without dash)
  const cleanedId = jobId.trim().replace(/^#/, ""); // Remove leading # and whitespace

  // Use the backend API proxy instead of calling SM8 directly
  // This avoids CORS issues by proxying through our server
  const response = await fetch(
    `/api/servicem8/job?id=${encodeURIComponent(cleanedId)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Job not found. Please check the job number.");
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = (await response.json()) as ServiceM8Response;

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.response) {
    throw new Error("Invalid API response");
  }

  return data.response;
}

export function extractCustomerDetails(job: SM8Job) {
  const client = job.client || {};
  return {
    firstName: client.first_name || "",
    lastName: client.last_name || "",
    email: client.email || "",
    phone: client.phone || client.mobile || "",
    address: client.address || job.address || "",
  };
}
