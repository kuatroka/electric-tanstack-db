import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityBarChart } from "@/components/charts";
import { useEffect, useState } from "react";

interface ActivityData {
  quarter: string;
  opened: number;
  closed: number;
  added: number;
  reduced: number;
  held: number;
}

interface DataFreshness {
  lastDataLoadDate: string;
  version: string;
  dbVersion: string;
}

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [freshness, setFreshness] = useState<DataFreshness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [activityRes, freshnessRes] = await Promise.all([
          fetch("/api/all-assets-activity"),
          fetch("/api/data-freshness"),
        ]);
        const activityJson = await activityRes.json();
        const freshnessJson = await freshnessRes.json();
        setActivityData(activityJson.activity);
        setFreshness(freshnessJson);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fintellectus</h1>
          <p className="text-muted-foreground">
            Superinvestor Portfolio Analytics
          </p>
        </div>
        {freshness && (
          <div className="text-sm text-muted-foreground">
            Data as of: {freshness.lastDataLoadDate}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/assets" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse all tracked securities and their superinvestor activity
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/superinvestors" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Superinvestors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View institutional investor portfolios and position changes
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <ActivityBarChart data={activityData} height={400} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
