/**
 * Login Trend Chart Component
 * Displays dual-axis line chart for login trends using Apache ECharts
 * - Left Y-axis: No. of Logins (Teal)
 * - Right Y-axis: Failed login % (Red)
 */
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { chartColors, uiColors, tooltipColors } from '../constants/colors';

interface LoginChartData {
  dates: string[];
  logins: number[];
  failedLogins: number[];
  loading: boolean;
  error: string;
}

interface LoginTrendChartProps {
  data: LoginChartData;
}

export function LoginTrendChart({ data }: LoginTrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.loading || data.error) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipColors.background,
        borderColor: 'transparent',
        textStyle: {
          color: tooltipColors.text,
          fontSize: 12,
        },
        formatter: (params: any) => {
          if (Array.isArray(params)) {
            let result = `<div>${params[0]?.axisValue}</div>`;
            params.forEach((param: any) => {
              result += `<div style="color: ${param.color}">${param.seriesName}: ${param.value}</div>`;
            });
            return result;
          }
          return '';
        },
      },
      grid: {
        left: 60,
        right: 60,
        top: 10,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        name: 'Date',
        nameTextStyle: { color: uiColors.text.secondary, fontSize: 12, fontWeight: 'normal' },
        nameLocation: 'middle',
        nameGap: 25,
        data: data.dates,
        axisLine: { lineStyle: { color: uiColors.grid.axisLine } },
        axisLabel: { show: true, fontSize: 12, color: uiColors.text.secondary },
        splitLine: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: 'No. of Logins',
          nameTextStyle: { color: uiColors.text.secondary, fontSize: 12, fontWeight: 'normal' },
          nameLocation: 'middle',
          nameGap: 50,
          axisLine: { show: false },
          axisLabel: { show: true, fontSize: 12, color: uiColors.text.secondary },
          splitLine: { lineStyle: { color: uiColors.grid.splitLine } },
          min: 0,
        },
        {
          type: 'value',
          name: 'Failed login %',
          nameTextStyle: { color: uiColors.text.secondary, fontSize: 12, fontWeight: 'normal' },
          nameLocation: 'middle',
          nameGap: 50,
          position: 'right',
          axisLine: { show: false },
          axisLabel: { show: true, fontSize: 12, color: uiColors.text.secondary },
          splitLine: { show: false },
          min: 0,
        },
      ],
      series: [
        {
          name: 'No. of Logins',
          type: 'line',
          yAxisIndex: 0,
          data: data.logins,
          stroke: 2,
          lineStyle: { color: chartColors.loginTrend.noOfLogins, width: 2 },
          itemStyle: { color: chartColors.loginTrend.noOfLogins },
          symbolSize: 4,
          smooth: false,
        },
        {
          name: 'Failed login %',
          type: 'line',
          yAxisIndex: 1,
          data: data.failedLogins,
          stroke: 2,
          lineStyle: { color: chartColors.loginTrend.failedLogin, width: 2 },
          itemStyle: { color: chartColors.loginTrend.failedLogin },
          symbolSize: 4,
          smooth: false,
        },
      ],
      legend: { show: false },
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  if (data.loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (data.error) {
    return <Box sx={{ flex: 1, minHeight: '300px' }} />;
  }

  return (
    <Box
      ref={chartRef}
      sx={{
        width: '100%',
        height: 280,
        marginBottom: '15px',
        position: 'relative',
        flex: 1,
      }}
    />
  );
}

/**
 * Legend for Login Trend Chart
 * Displays colored dots with labels for both series
 */
export function LoginTrendLegend() {
  return (
    <Box
      sx={{
        paddingTop: '7px',
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        fontSize: '12px',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        <Box
          sx={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: chartColors.loginTrend.noOfLogins,
            flexShrink: 0,
          }}
        />
        <span>No. of Logins</span>
      </Box>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        <Box
          sx={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: chartColors.loginTrend.failedLogin,
            flexShrink: 0,
          }}
        />
        <span>Failed login %</span>
      </Box>
    </Box>
  );
}
