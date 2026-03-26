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
  const response = await fetch(
    `https://api.servicem8.com/api_1.0/job/${jobId}.json`,
    {
      headers: {
        Authorization: `Bearer smk-a5f784-bcf831f418766718-c61b510d0ddb07db`,
      },
    }
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
