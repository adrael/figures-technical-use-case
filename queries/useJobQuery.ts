import { useQuery, UseQueryResult } from "react-query";

const serverUrl = "http://localhost:3001";

export function useJobQuery(): UseQueryResult<Job[]> {
  return useQuery(["jobs"], async () => {
    const result = await fetch(`${serverUrl}/jobs`);
    return result.json();
  });
}

export interface Job {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
