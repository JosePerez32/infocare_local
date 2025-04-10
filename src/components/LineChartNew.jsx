import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ 
  data, 
  isTimeScale = true,
  yAxisLegend = "Value",
  xAxisLegend = "Time",
  margin = { top: 50, right: 30, bottom: 70, left: 60 },
  showPoints = true
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0 || !data[0]?.data || data[0].data.length === 0) {
    return <div>No valid data available</div>;
  }

  // Configuración del eje X optimizada
  const axisBottomConfig = {
    orient: "bottom",
    tickValues: "every 5 hours", // Mostrar una etiqueta cada 5 horas
    format: (value) => {
      const date = new Date(value);
      // Formato: "HH:MM\nMM/DD" (hora y fecha en dos líneas)
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}\n${date.getMonth()+1}/${date.getDate()}`;
    },
    tickRotation: 0,
    legend: xAxisLegend,
    legendOffset: 40,
    legendPosition: "middle",
    tickPadding: 10
  };

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { 
              fill: colors.grey[100],
              fontSize: 12 
            }
          }
        },
        grid: { line: { stroke: colors.grey[800], strokeWidth: 0.5 } },
        legends: { text: { fill: colors.grey[100] } },
        tooltip: {
          container: {
            background: colors.primary[900],
            color: colors.grey[100],
            fontSize: 14,
            borderRadius: 4,
            boxShadow: "0 3px 9px rgba(0, 0, 0, 0.5)"
          }
        }
      }}
      colors={{ datum: "color" }}
      margin={margin}
      xScale={{
        type: "time",
        format: "%Y-%m-%dT%H:%M:%S.%LZ",
        precision: "minute",
        useUTC: true,
        min: "auto",
        max: "auto"
      }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: false,
        reverse: false
      }}
      curve="linear"
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottomConfig}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxisLegend,
        legendOffset: -45,
        legendPosition: "middle"
      }}
      enableGridX={false}
      enableGridY={true}
      pointSize={6}
      pointColor={{ from: "serieColor" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor", modifiers: [["darker", 0.3]] }}
      pointLabelYOffset={-12}
      enableSlices="x"
      useMesh={true}
      enableArea={false}
      enablePoints={showPoints}
      lineWidth={2}
      legends={[
        {
          anchor: "top-right",
          direction: "column",
          justify: false,
          translateX: 20,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      motionConfig="gentle"
    />
  );
};

export default LineChart;