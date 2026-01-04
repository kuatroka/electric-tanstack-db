import { useRef, useEffect, useLayoutEffect } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

type Options = uPlot.Options;
type AlignedData = uPlot.AlignedData;

interface UPlotChartProps {
  options: Options;
  data: AlignedData;
  className?: string;
}

export function UPlotChart({ options, data, className }: UPlotChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<uPlot | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Create chart
    chartRef.current = new uPlot(options, data, containerRef.current);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  // Update data when it changes
  useEffect(() => {
    if (chartRef.current && data) {
      chartRef.current.setData(data);
    }
  }, [data]);

  // Handle resize
  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0] && chartRef.current) {
        const { width, height } = entries[0].contentRect;
        chartRef.current.setSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}

// Helper to create common chart options
export function createLineChartOptions(
  title: string,
  series: Array<{ label: string; stroke: string; fill?: string }>
): Options {
  return {
    width: 800,
    height: 400,
    title,
    cursor: {
      sync: {
        key: "sync-key",
      },
    },
    scales: {
      x: { time: false },
    },
    series: [
      {},
      ...series.map((s) => ({
        label: s.label,
        stroke: s.stroke,
        fill: s.fill,
        width: 2,
      })),
    ],
    axes: [
      {
        stroke: "#888",
        grid: { stroke: "#e0e0e0", width: 1 },
      },
      {
        stroke: "#888",
        grid: { stroke: "#e0e0e0", width: 1 },
      },
    ],
  };
}
