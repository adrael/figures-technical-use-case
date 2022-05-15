import { Seniority } from "../queries/useSalaryComputationQuery";

interface Employee {
  id: number;
  jobId: number;
  seniority: Seniority | string;
  salary: number;
}

interface ComputedSalaries {
  seniority: Seniority | string;
  salaryRange: [number, number];
  values: {
    median: number;
    q25: number;
    q75: number;
  }
}

export function computeStats(employees: Employee[]): ComputedSalaries[] {
  const employeesBySeniority = employees.reduce((acc: Record<string, any>, val) => {
    if (!acc[val.seniority]) {
      acc[val.seniority] = {
        salaries: [],
        salaryRange: [val.salary, val.salary],
      };
    }

    const minSalary = Math.min(acc[val.seniority].salaryRange[0], val.salary);
    const maxSalary = Math.max(acc[val.seniority].salaryRange[1], val.salary);
    acc[val.seniority].salaryRange = [minSalary, maxSalary];
    acc[val.seniority].salaries.push(val.salary);

    return acc;
  }, {});

  return Object.values(Seniority).map((seniority: Seniority | string) => {
    return {
      seniority,
      salaryRange: employeesBySeniority[seniority].salaryRange.map((salary: number) => salary / 100),
      values: {
        q25: computeQ25(employeesBySeniority[seniority].salaries) / 100,
        q75: computeQ75(employeesBySeniority[seniority].salaries) / 100,
        median: computeMedian(employeesBySeniority[seniority].salaries) / 100,
      }
    };
  });
}

function quantile(values: number[], q: number) {
  const sorted = values.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }

  return sorted[base];
}

const computeQ25 = (values: number[]) => quantile(values, .25);
const computeMedian = (values: number[]) => quantile(values, .50);
const computeQ75 = (values: number[]) => quantile(values, .75);
