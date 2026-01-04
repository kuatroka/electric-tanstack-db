import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

interface EChartsWrapperProps {
  option: EChartsOption;
  className?: string;
  style?: React.CSSProperties;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function EChartsWrapper({
  option,
  className,
  style,
  onEvents,
}: EChartsWrapperProps) {
  return (
    <ReactECharts
      option={option}
      className={className}
      style={style || { height: "400px", width: "100%" }}
      onEvents={onEvents}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}

// Helper to create treemap options for sector breakdown
export function createTreemapOption(
  data: Array<{ name: string; value: number; children?: unknown[] }>
): EChartsOption {
  return {
    tooltip: {
      formatter: "{b}: {c}",
    },
    series: [
      {
        type: "treemap",
        data,
        label: {
          show: true,
          formatter: "{b}",
        },
        breadcrumb: {
          show: true,
        },
      },
    ],
  };
}

// Helper to create pie chart options
export function createPieOption(
  data: Array<{ name: string; value: number }>,
  title?: string
): EChartsOption {
  return {
    title: title ? { text: title, left: "center" } : undefined,
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
}
