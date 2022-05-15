import React, { ChangeEvent } from "react";
import "../styles/styles.css";

import { useSalaryComputationQuery } from "../queries/useSalaryComputationQuery";
import { QueryClient, QueryClientProvider } from "react-query";
import { Job, useJobQuery } from "../queries/useJobQuery";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

function Home() {
  const jobsQuery = useJobQuery();
  const [selectedJobId, setSelectedJobId] = React.useState<Job["id"]>(-1);

  if (jobsQuery.isLoading) {
    return <p>Loading...</p>;
  }

  return <>
    <div className="container mx-auto p-5">
      <div className="flex mb-3">
        <div className="flex-none mr-3">
          Job selection:
        </div>

        <div className="flex-1">
          <Select value={selectedJobId}
                  onChange={(e) => setSelectedJobId(+e.target.value)}
                  options={jobsQuery.data}
                  label="Pick a job to see market compensation" />
        </div>
      </div>

      {selectedJobId !== -1 && (
        <div className="mb-3">
          <SalaryCharts jobId={selectedJobId} />
        </div>
      )}
    </div>
  </>;
}

function CustomTooltip({ payload, label, active }) {
  if (active) {
    return (
      <div className="container bg-white p-3">
        <h5 className="mb-3">Data for <strong>{label}</strong> level</h5>
        <p>Min. salary: <code className="text-red-600	">{payload[0].value[0]}</code></p>
        <p>Max. salary: <code className="text-red-600	">{payload[0].value[1]}</code></p>
        <p>Median salary: <code className="text-red-600	">{payload[0].payload.values.median}</code></p>
        <p>Q25 salary: <code className="text-red-600	">{payload[0].payload.values.q25}</code></p>
        <p>Q75 salary: <code className="text-red-600	">{payload[0].payload.values.q75}</code></p>
      </div>
    );
  }

  return null;
}

function SalaryCharts({ jobId }: { jobId: Job["id"] }) {
  const employeesQuery = useSalaryComputationQuery({ jobId });

  if (employeesQuery.isLoading) {
    return <p>Loading salaries...</p>;
  }

  return <div className="container mx-auto">
    <BarChart
      width={500}
      height={300}
      data={employeesQuery.data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="seniority" />
      <YAxis />
      <Tooltip content={<CustomTooltip />}/>
      <Bar dataKey="salaryRange" fill="#8884d8" />
    </BarChart>
  </div>;
}

interface SelectOption {
  id: any;
  name: string;
}

interface SelectProps {
  value: any;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  label: string;
}

function Select({ value, onChange, options, label }: SelectProps) {
  return <select value={value.toString()} onChange={onChange} className="border border-solid border-gray-300 rounded">
    <option value={-1}>{label}</option>
    {options.map((option) => (
      <option key={option.id} value={option.id}>{option.name}</option>
    ))}
  </select>;
}
