import { Box, FormControl, Select, MenuItem, TextField } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import Header from '../../components/Header';
import { ResponsiveLine } from '@nivo/line';

const WorkloadThroughputCharts = () => {
  const theme = useTheme();
  const { organization } = useLocation().state || {};
  const colors = tokens(theme.palette.mode);
  const { source } = useParams();
  const [workloadData, setWorkloadData] = useState({});
  const [rows] = useState(20);
  const [grouping, setGrouping] = useState('sec');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() - 6);
    return now.toISOString().slice(0, 19);
  });

  // Define metrics to show and their properties
  const metricsToShow = [
    {
      id: 'act_completed_total_per_sec',
      label: 'Activities Completed',
      color: '#008FD5'
    },
    {
      id: 'select_sql_stmts_per_sec',
      label: 'Select Statements',
      color: '#71D8BD'
    },
    {
      id: 'rows_returned_per_sec',
      label: 'Rows Returned',
      color: '#FFB547'
    },
    {
      id: 'rows_modified_per_sec',
      label: 'Rows Modified',
      color: '#FF8A65'
    }
  ];

  useEffect(() => {
    const fetchWorkloadData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
  
        const dateObj = new Date(startTime);
        const timezoneOffset = dateObj.getTimezoneOffset();
        const offsetSign = timezoneOffset > 0 ? '-' : '+';
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
  
        const formattedDateTime = dateObj.toISOString().slice(0, -1) + offsetSign + offsetHours + ':' + offsetMinutes;
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/metrics/${source}/workload_throughput?start_time=${encodeURIComponent(
            formattedDateTime
          )}&rows=${rows}&grouping=${grouping}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const rawData = await response.json();
  
        // Transform data for each workload
        const transformed = {};
        rawData.workloads.forEach(workload => {
          transformed[workload.workload_id] = metricsToShow.map(metric => ({
            id: metric.label,
            color: metric.color,
            data: rawData.timestamps.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: workload[metric.id][index]
            })).reverse()
          }));
        });

        setWorkloadData(transformed);
      } catch (error) {
        console.error('Error fetching workload data:', error);
      }
    };
  
    fetchWorkloadData();
    const interval = setInterval(fetchWorkloadData, 5000);
  
    return () => clearInterval(interval);
  }, [organization, source, startTime, rows, grouping]);

  const renderWorkloadChart = (workloadId, data) => (
    <Box 
      key={workloadId}
      backgroundColor={colors.primary[400]}
      p="20px"
      width="800px"
      borderRadius="8px"
      mb={3}
    >
      <Box mb={2}>
        <h3 style={{ color: colors.grey[100], margin: 0 }}>Workload {workloadId}</h3>
      </Box>
      <Box height="400px">
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 140, bottom: 40, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ 
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legendOffset: 40,
            legendPosition: 'middle',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Operations per second',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          colors={{ datum: 'color' }}
          pointSize={4}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableGridX={false}
          theme={{
            background: colors.primary[400],
            textColor: colors.grey[100],
            fontSize: 11,
            axis: {
              domain: {
                line: {
                  stroke: colors.grey[100],
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
            grid: {
              line: {
                stroke: colors.grey[500],
                strokeWidth: 1,
              },
            },
            legends: {
              text: {
                fill: colors.grey[100],
              },
            },
            tooltip: {
              container: {
                background: colors.primary[400],
                color: colors.grey[100],
              },
            },
          }}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 140,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
            }
          ]}
        />
      </Box>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Workload Throughput" subtitle="Database Workload Metrics" />
      
      <Box mb={3}>
        <Box display="flex" gap="16px" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <TextField
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              size="small"
              sx={{
                backgroundColor: colors.primary[400],
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.grey[100],
                  },
                  '&:hover fieldset': {
                    borderColor: colors.grey[100],
                  },
                },
                '& .MuiInputBase-input': {
                  color: colors.grey[100],
                },
              }}
            />
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}
              sx={{
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.grey[100],
                },
              }}
            >
              <MenuItem value="sec">Seconds</MenuItem>
              <MenuItem value="min">Minutes</MenuItem>
              <MenuItem value="uur">Hours</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {Object.entries(workloadData).map(([workloadId, data]) => 
        renderWorkloadChart(workloadId, data)
      )}
    </Box>
  );
};

export default WorkloadThroughputCharts;