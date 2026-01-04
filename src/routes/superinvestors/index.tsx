import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/DataTable";
import { LatencyBadge, type DataFlow } from "@/components/LatencyBadge";
import { useContentReady } from "@/hooks/useContentReady";
import { useEffect, useState, useMemo } from "react";
import { useSearch as useElectricSearch } from "@/hooks/useSearch";

interface Superinvestor {
  id: number;
  cik: string;
  name: string | null;
  ticker: string | null;
  activePeriods: string | null;
}

export const Route = createFileRoute("/superinvestors/")({
  component: SuperinvestorsPage,
});

function SuperinvestorsPage() {
  const [investors, setInvestors] = useState<Superinvestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [latencyMs, setLatencyMs] = useState<number>();
  const [dataFlow, setDataFlow] = useState<DataFlow>("rq-api");
  const [searchQuery, setSearchQuery] = useState("");
  const { onReady } = useContentReady();

  // Use Electric SQL for searching when query >= 2 chars
  const {
    results: electricResults,
    latencyMs: electricLatencyMs,
    dataFlow: electricDataFlow,
  } = useElectricSearch(searchQuery);

  useEffect(() => {
    async function fetchInvestors() {
      const startTime = performance.now();
      setLoading(true);
      try {
        // Fetch all investors for client-side filtering/pagination
        const res = await fetch(`/api/superinvestors?limit=10000&offset=0`);
        const json = await res.json();
        setInvestors(json.superinvestors);
        setTotal(json.total);
        setDataFlow("rq-api");
      } catch (error) {
        console.error("Failed to fetch superinvestors:", error);
      } finally {
        const endTime = performance.now();
        setLatencyMs(Math.round((endTime - startTime) * 100) / 100);
        setLoading(false);
        onReady();
      }
    }
    fetchInvestors();
  }, [onReady]);

  // When searching, use Electric SQL results (searches all superinvestors)
  // When not searching, use the loaded data for browsing
  const displayData = useMemo(() => {
    if (searchQuery.length >= 2) {
      // Filter to only superinvestors (category === "superinvestors")
      return electricResults
        .filter((r) => r.category === "superinvestors")
        .map((r) => ({
          id: r.id,
          cik: r.code,
          name: r.name,
          ticker: null,
          activePeriods: null,
        }));
    }
    return investors;
  }, [searchQuery, electricResults, investors]);

  const displayLatency =
    searchQuery.length >= 2 ? electricLatencyMs : latencyMs;
  const displayDataFlow: DataFlow =
    searchQuery.length >= 2 ? electricDataFlow : dataFlow;

  const columns: ColumnDef<Superinvestor>[] = [
    {
      key: "cik",
      header: "CIK",
      sortable: true,
      searchable: true,
      clickable: true,
      render: (_, row) => (
        <Link
          to="/superinvestors/$cik"
          params={{ cik: row.cik }}
          className="text-primary hover:underline font-mono"
        >
          {row.cik}
        </Link>
      ),
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      searchable: true,
      render: (value) => (
        <span className="font-medium">{(value as string) || "-"}</span>
      ),
    },
    {
      key: "ticker",
      header: "Ticker",
      sortable: true,
      render: (value) =>
        value ? (
          <Badge variant="outline">{value as string}</Badge>
        ) : (
          "-"
        ),
    },
    {
      key: "activePeriods",
      header: "Active Periods",
      sortable: false,
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {(value as string) || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Superinvestors</h1>
          <p className="text-muted-foreground">
            {total.toLocaleString()} institutional investors
          </p>
        </div>
        {latencyMs !== undefined && (
          <LatencyBadge latencyMs={latencyMs} source={dataFlow} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investor List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <DataTable
              data={displayData}
              columns={columns}
              searchPlaceholder="Filter by name or CIK..."
              defaultPageSize={20}
              defaultSortColumn="name"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchDisabled={searchQuery.length >= 2}
              latencyBadge={
                displayLatency !== undefined ? (
                  <LatencyBadge latencyMs={displayLatency} source={displayDataFlow} />
                ) : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
