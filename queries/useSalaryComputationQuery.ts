import { useQuery } from "react-query";
import { UseQueryResult } from "react-query";
import { Job } from "./useJobQuery";

const serverUrl = "http://localhost:3001";

export function useSalaryComputationQuery({ jobId }: { jobId: Job["id"] }): UseQueryResult<SalaryResult[]> {
  return useQuery(["employees", jobId], async () => {
    const result = await fetch(`${serverUrl}/employees/${jobId}`);
    return result.json();
  });
}

export interface SalaryResult {
  seniority: Seniority | string;
  salaryRange: [number, number];
}

export enum Seniority {
  Junior = "Junior",
  Intermediate = "Intermediate",
  Senior = "Senior",
}
