import { ResponsiveLine } from "@nivo/line"; 
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ 
  data, 
  isCustomLineColors = false, 
  isDashboard = false, 
  yAxisLegend, 
  xAxisLegend,
  isTimeScale = true // Nueva prop para indicar escala temporal
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  // Configuración del eje X basada en el tipo de escala
  const axisBottomConfig = {
    orient: "bottom",
    tickSize: 0,
    tickPadding: 5,
    tickRotation: 0,
    legend: isDashboard ? undefined : xAxisLegend,
    legendOffset: 36,
    legendPosition: "middle",
    ...(isTimeScale && {
      format: (value) => {
        const date = new Date(value);
        const hours = date.getHours();
        // Mostrar solo cada 5 horas (0, 5, 10, 15, 20, 25)
        if (hours % 5 === 0) {
          return `${hours.toString().padStart(2, '0')}:00`;
        }
        return '';
      },
      tickValues: 6 // Mostrar exactamente 6 marcas
    })
  };

  return (
    <ResponsiveLine
      data={data}
      theme={{
        // ... (mantén el theme existente)
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
      margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
      xScale={{
        type: isTimeScale ? "time" : "point",
        format: "%Y-%m-%dT%H:%M:%S.%LZ",
        precision: "hour",
        useUTC: true
      }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottomConfig}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : yAxisLegend,
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          dataFrom: "keys",
          anchor: "top",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: -40,
          itemsSpacing: 10,
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
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;