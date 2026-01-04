import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultiLineChart } from "@/components/charts";
import { LatencyBadge, type DataFlow } from "@/components/LatencyBadge";
import { useContentReady } from "@/hooks/useContentReady";
import { useEffect, useState } from "react";

interface Superinvestor {
  cik: string;
  name: string | null;
  ticker: string | null;
  activePeriods: string | null;
}

interface QuarterlyData {
  quarter: string;
  quarterEndDate: string;
  totalValue: string;
  totalValuePrcChg: string;
  numAssets: number;
}

export const Route = createFileRoute("/superinvestors/$cik")({
  component: SuperinvestorDetailPage,
});

function SuperinvestorDetailPage() {
  const { cik } = Route.useParams();
  const [investor, setInvestor] = useState<Superinvestor | null>(null);
  const [quarterly, setQuarterly] = useState<QuarterlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [latencyMs, setLatencyMs] = useState<number>();
  const [dataFlow, setDataFlow] = useState<DataFlow>("rq-api");
  const { onReady } = useContentReady();

  useEffect(() => {
    async function fetchData() {
      const startTime = performance.now();
      setLoading(true);
      try {
        const [investorRes, quarterlyRes] = await Promise.all([
          fetch(`/api/superinvestors/${cik}`),
          fetch(`/api/cik-quarterly/${cik}`),
        ]);
        const investorJson = await investorRes.json();
        const quarterlyJson = await quarterlyRes.json();
        setInvestor(investorJson.superinvestor);
        setQuarterly(quarterlyJson.quarterly);
        setDataFlow("rq-api");
      } catch (error) {
        console.error("Failed to fetch superinvestor data:", error);
      } finally {
        const endTime = performance.now();
        setLatencyMs(Math.round((endTime - startTime) * 100) / 100);
        setLoading(false);
        onReady();
      }
    }
    fetchData();
  }, [cik, onReady]);

  const chartData = quarterly.map((q) => ({
    quarter: q.quarter,
    value: parseFloat(q.totalValue) / 1_000_000_000, // Convert to billions
    assets: q.numAssets,
  }));

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/superinvestors"
          className="text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Superinvestors
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {investor?.name || `CIK ${cik}`}
            </h1>
            <Badge variant="secondary">Superinvestor</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">CIK: {cik}</p>
          {investor?.ticker && (
            <Badge variant="outline" className="mt-2">
              {investor.ticker}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          {latencyMs !== undefined && (
            <LatencyBadge latencyMs={latencyMs} source={dataFlow} />
          )}
          {investor?.activePeriods && (
            <div className="text-sm text-muted-foreground">
              Active: {investor.activePeriods}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quarterly.length > 0 && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Latest Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {(
                    parseFloat(quarterly[quarterly.length - 1].totalValue) /
                    1_000_000_000
                  ).toFixed(2)}
                  B
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Number of Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {quarterly[quarterly.length - 1].numAssets}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Quarterly Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    parseFloat(quarterly[quarterly.length - 1].totalValuePrcChg) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {parseFloat(
                    quarterly[quarterly.length - 1].totalValuePrcChg
                  ).toFixed(2)}
                  %
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Portfolio Value Over Time</CardTitle>
            {latencyMs !== undefined && (
              <LatencyBadge latencyMs={latencyMs} source={dataFlow} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <MultiLineChart
              data={chartData}
              series={[
                { dataKey: "value", name: "Portfolio Value ($B)", color: "#3b82f6" },
              ]}
              xAxisKey="quarter"
              height={400}
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No quarterly data available for this investor
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
