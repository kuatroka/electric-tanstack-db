import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityBarChart } from "@/components/charts";
import { LatencyBadge, type DataFlow } from "@/components/LatencyBadge";
import { useContentReady } from "@/hooks/useContentReady";
import { useEffect, useState } from "react";

interface Asset {
  id: number;
  code: string;
  name: string | null;
  cusip: string | null;
}

interface ActivityData {
  quarter: string;
  opened: number;
  closed: number;
  added: number;
  reduced: number;
  held: number;
}

export const Route = createFileRoute("/assets/$code")({
  component: AssetDetailPage,
});

function AssetDetailPage() {
  const { code } = Route.useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [activity, setActivity] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [latencyMs, setLatencyMs] = useState<number>();
  const [dataFlow, setDataFlow] = useState<DataFlow>("rq-api");
  const { onReady } = useContentReady();

  useEffect(() => {
    async function fetchData() {
      const startTime = performance.now();
      setLoading(true);
      try {
        const [assetRes, activityRes] = await Promise.all([
          fetch(`/api/assets/${code}`),
          fetch(`/api/all-assets-activity?ticker=${code}`),
        ]);
        const assetJson = await assetRes.json();
        const activityJson = await activityRes.json();
        setAsset(assetJson.asset);
        setActivity(activityJson.activity);
        setDataFlow("rq-api");
      } catch (error) {
        console.error("Failed to fetch asset data:", error);
      } finally {
        const endTime = performance.now();
        setLatencyMs(Math.round((endTime - startTime) * 100) / 100);
        setLoading(false);
        onReady();
      }
    }
    fetchData();
  }, [code, onReady]);

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
          to="/assets"
          className="text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Assets
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{code}</h1>
            <Badge variant="secondary">Asset</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {asset?.name || "Unknown"}
          </p>
          {asset?.cusip && (
            <p className="text-sm text-muted-foreground font-mono">
              CUSIP: {asset.cusip}
            </p>
          )}
        </div>
        {latencyMs !== undefined && (
          <LatencyBadge latencyMs={latencyMs} source={dataFlow} />
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Superinvestor Activity</CardTitle>
            {latencyMs !== undefined && (
              <LatencyBadge latencyMs={latencyMs} source={dataFlow} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activity.length > 0 ? (
            <ActivityBarChart data={activity} height={400} />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No activity data available for this asset
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
