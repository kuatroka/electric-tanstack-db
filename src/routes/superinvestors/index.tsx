import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

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
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 50;

  useEffect(() => {
    async function fetchInvestors() {
      setLoading(true);
      try {
        const offset = page * limit;
        const res = await fetch(`/api/superinvestors?limit=${limit}&offset=${offset}`);
        const json = await res.json();
        setInvestors(json.superinvestors);
        setTotal(json.total);
      } catch (error) {
        console.error("Failed to fetch superinvestors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInvestors();
  }, [page]);

  const filteredInvestors = search
    ? investors.filter(
        (i) =>
          i.name?.toLowerCase().includes(search.toLowerCase()) ||
          i.cik.includes(search)
      )
    : investors;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Superinvestors</h1>
          <p className="text-muted-foreground">
            {total.toLocaleString()} institutional investors
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Investor List</CardTitle>
            <Input
              placeholder="Filter by name or CIK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CIK</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Active Periods</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvestors.map((investor) => (
                    <TableRow key={investor.id}>
                      <TableCell>
                        <Link
                          to="/superinvestors/$cik"
                          params={{ cik: investor.cik }}
                          className="text-primary hover:underline font-mono"
                        >
                          {investor.cik}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        {investor.name || "-"}
                      </TableCell>
                      <TableCell>
                        {investor.ticker ? (
                          <Badge variant="outline">{investor.ticker}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {investor.activePeriods || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
