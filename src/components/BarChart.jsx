import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = ({ data, isCustomLineColors = false, isDashboard = false, yAxisLegend, xAxisLegend }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Check if data is available and in the correct format
  if (!data || data.length === 0 || !data[0].data) {
    return <div>No data available</div>;
  }

  const chartType = data[0].id; // Get the chart type from the data

  // Transform data to match Nivo's expected format
  const transformedData = data[0].data.map(item => ({
    time: item.x,
    [chartType]: item.y // Use the chart type as the key
  }));

  return (
    <ResponsiveBar
      data={transformedData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              //fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            //fill: colors.grey[100],
          },
        },
      }}
      keys={[chartType]} // Use the chart type as the key
      indexBy="time"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        //legend: isDashboard ? undefined : xAxisLegend,
        //legendPosition: "middle",
        //legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : yAxisLegend,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      tooltip={({ id, value, indexValue }) => (
        <div
          style={{
            padding: "5px 10px",
            background: colors.primary[500],
            color: "white",
            borderRadius: "3px",
          }}
        >
          {indexValue === "Source" ? (
            <strong>Source only</strong>
          ) : indexValue === "Diff" ? (
            <strong>Difference only</strong>
          ) : indexValue === "Target" ? (
            <strong>Target only</strong>
          ) : (
            <strong>{indexValue}</strong>
          )}: {value}
        </div>
      )}
      //This was commented to delete the little quadro above the grafics
      /*legends={[
        {
          dataFrom: "keys",
          anchor: "top",
          direction: "row", // Change direction to row to align items horizontally
          justify: false,
          translateX: 0, // Center the legend horizontally
          translateY: -40, // Move the legend upwards
          itemsSpacing: 10, // Increase spacing between items
          itemWidth: 80,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}*/
      role="application"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} at time: ${e.indexValue}`}
    />
  );
};

export default BarChart;
