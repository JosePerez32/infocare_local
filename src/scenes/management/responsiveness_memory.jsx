import React, { useState, useEffect, useCallback } from 'react';
import { Box, FormControl, Select, MenuItem, TextField, Grid } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useParams, useLocation } from "react-router-dom";
import Header from '../../components/Header';
import { ResponsiveLine } from '@nivo/line';

const PerformanceMetricsCharts = () => {
  const theme = useTheme();
  const { organization } = useLocation().state || {};
  const colors = tokens(theme.palette.mode);
  const { source } = useParams();

  // Buffer Pool Data States
  const [bufferPoolData, setBufferPoolData] = useState([
    {
      id: 'BP_1 Hit Ratio',
      color: '#008FD5',
      data: []
    },
    {
      id: 'BP_2 Hit Ratio',
      color: '#71D8BD',
      data: []
    }
  ]);

  // Swap and Committed Memory Data States
  const [swapUsageData, setSwapUsageData] = useState([
    {
      id: 'Swap Pages In',
      color: '#008FD5',
      data: []
    },
    {
      id: 'Swap Pages Out',
      color: '#71D8BD',
      data: []
    }
  ]);

  const [committedMemoryData, setCommittedMemoryData] = useState([
    {
      id: 'Committed Memory',
      color: '#FF6384',
      data: []
    }
  ]);

  // Common State
  const [rows] = useState(30);
  const [grouping, setGrouping] = useState('sec');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format for datetime-local input
  });

  const fetchPerformanceData = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
  
      const dateObj = new Date(startTime);
      const timezoneOffset = dateObj.getTimezoneOffset();
      const offsetSign = timezoneOffset > 0 ? '-' : '+';
      const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
      const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
  
      const formattedDateTime = dateObj.toISOString().slice(0, -1) + offsetSign + offsetHours + ':' + offsetMinutes;
  
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dashboards/${organization}/metrics/${source}/memory_usage?start_time=${encodeURIComponent(
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
  
      // Transform Buffer Pool Data
      const bufferPoolTransformedData = rawData.bufferpools.map(pool => ({
        id: `${pool.name} Hit Ratio`,
        color: '#008FD5',
        data: pool.hitratios.map((hitratio, index) => ({
          x: new Date(rawData.timestamps[index]).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
          }),
          y: parseFloat(hitratio || 0),
        }))
      }));
  
      // Transform Swap Usage Data
      const swapTransformedData = [
        {
          id: 'Swap Pages In',
          color: '#008FD5',
          data: rawData.timestamps.map((time, index) => ({
            x: new Date(time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit', 
              hour12: false 
            }),
            y: rawData.swap_usage?.swap_pages_in?.[index] || 0,
          }))
        },
        {
          id: 'Swap Pages Out',
          color: '#71D8BD',
          data: rawData.timestamps.map((time, index) => ({
            x: new Date(time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit', 
              hour12: false 
            }),
            y: rawData.swap_usage?.swap_pages_out?.[index] || 0,
          }))
        }
      ];
  
      const committedMemoryTransformedData = [
        {
          id: 'Committed Memory',
          color: '#FF6384',
          data: rawData.timestamps.map((time, index) => ({
            x: new Date(time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit', 
              hour12: false 
            }),
            y: rawData.committed_memory?.[index] || 0,
          }))
        }
      ];

      // Update states
      setBufferPoolData(bufferPoolTransformedData);
      setSwapUsageData(swapTransformedData);
      setCommittedMemoryData(committedMemoryTransformedData);
  
    } catch (error) {
      console.error('Error fetching Performance Metrics data:', error);
    }
  }, [organization, source, startTime, rows, grouping]);

  // Fetch data on component mount and at intervals
  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 5000);
  
    return () => clearInterval(interval);
  }, [fetchPerformanceData]);

  // Dynamic Y-Scale calculation
  const getDynamicYScale = (data, isPercentage = false) => {
    const allYValues = data.flatMap((series) => series.data.map((point) => point.y));
    const minY = Math.min(...allYValues);
    const maxY = Math.max(...allYValues);

    // Add a buffer if min and max are equal
    const buffer = minY === maxY ? minY * 0.1 : 0;

    return {
      type: 'linear',
      min: isPercentage ? 0 : minY - buffer,
      max: isPercentage ? 100 : maxY + buffer,
      stacked: false,
    };
  };

  // Reusable chart rendering function
  const renderLineChart = (data, isPercentage = false) => (
    <Box 
      backgroundColor={colors.primary[400]}
      p="20px"
      borderRadius="8px"
      height="400px"
    >
      <Box height="340px">
        {data[0].data.length > 0 && (
          <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 100, bottom: 40, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={getDynamicYScale(data, isPercentage)}
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
                translateX: 90, 
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
              }
            ]}
          />
        )}
      </Box>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Performance Metrics" subtitle="Buffer Pool and Memory Usage" />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <FormControl size="small" sx={{ minWidth: 250 }}>
          <TextField
            type="datetime-local"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              fetchPerformanceData(); // Immediately fetch data when date changes
            }}
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
            onChange={(e) => {
              setGrouping(e.target.value);
              fetchPerformanceData(); // Immediately fetch data when grouping changes
            }}
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
            <MenuItem value="hour">Hours</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {/* Buffer Pool Metrics */}
        <Grid item xs={12}>
          <Box>
            <Box mb={2} ml={2}>
              <h3 style={{ color: colors.grey[100], margin: 0 }}>Buffer Pool Hit Ratios</h3>
            </Box>
            {renderLineChart(
              bufferPoolData, 
              true // Percentage scale
            )}
          </Box>
        </Grid>

        {/* Memory Usage Metrics */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box mb={2} ml={2}>
              <h3 style={{ color: colors.grey[100], margin: 0 }}>Swap Usage</h3>
            </Box>
            {renderLineChart(swapUsageData)}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Box mb={2} ml={2}>
              <h3 style={{ color: colors.grey[100], margin: 0 }}>Committed Memory</h3>
            </Box>
            {renderLineChart(committedMemoryData)}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceMetricsCharts;