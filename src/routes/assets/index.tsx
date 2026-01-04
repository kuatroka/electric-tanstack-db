import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/DataTable";
import { LatencyBadge, type DataFlow } from "@/components/LatencyBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useContentReady } from "@/hooks/useContentReady";
import { useEffect, useState, useMemo } from "react";
import { useSearch as useElectricSearch } from "@/hooks/useSearch";

interface Asset {
  id: number;
  code: string;
  name: string | null;
  cusip: string | null;
}

export const Route = createFileRoute("/assets/")({
  component: AssetsPage,
});

function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
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
    async function fetchAssets() {
      const startTime = performance.now();
      setLoading(true);
      try {
        // Fetch all assets for client-side filtering/pagination
        const res = await fetch(`/api/assets?limit=10000&offset=0`);
        const json = await res.json();
        setAssets(json.assets);
        setTotal(json.total);
        setDataFlow("rq-api");
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      } finally {
        const endTime = performance.now();
        setLatencyMs(Math.round((endTime - startTime) * 100) / 100);
        setLoading(false);
        onReady();
      }
    }
    fetchAssets();
  }, [onReady]);

  // When searching, use Electric SQL results (searches all assets)
  // When not searching, use the loaded assets for browsing
  const displayData = useMemo(() => {
    if (searchQuery.length >= 2) {
      // Filter to only assets (category === "assets")
      return electricResults
        .filter((r) => r.category === "assets")
        .map((r) => ({
          id: r.id,
          code: r.code,
          name: r.name,
          cusip: r.cusip,
        }));
    }
    return assets;
  }, [searchQuery, electricResults, assets]);

  const displayLatency =
    searchQuery.length >= 2 ? electricLatencyMs : latencyMs;
  const displayDataFlow: DataFlow =
    searchQuery.length >= 2 ? electricDataFlow : dataFlow;

  const columns: ColumnDef<Asset>[] = [
    {
      key: "code",
      header: "Ticker",
      sortable: true,
      searchable: true,
      clickable: true,
      render: (_, row) => (
        <Link
          to="/assets/$code"
          params={{ code: row.code }}
          className="text-primary hover:underline font-medium"
        >
          {row.code}
        </Link>
      ),
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      searchable: true,
      render: (value) => (value as string) || "-",
    },
    {
      key: "cusip",
      header: "CUSIP",
      sortable: true,
      searchable: true,
      render: (value) => (
        <span className="font-mono text-sm">{(value as string) || "-"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground">
            {total.toLocaleString()} tracked securities
          </p>
        </div>
        {latencyMs !== undefined && (
          <LatencyBadge latencyMs={latencyMs} source={dataFlow} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Securities List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <LoadingSpinner size="lg" text="Loading assets..." />
            </div>
          ) : (
            <DataTable
              data={displayData}
              columns={columns}
              searchPlaceholder="Filter by ticker, name, or CUSIP..."
              defaultPageSize={20}
              defaultSortColumn="code"
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
