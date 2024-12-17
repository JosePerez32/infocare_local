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

  // Helper function for timestamp formatting
  const formatTimestamp = (time, grouping) => {
    const date = new Date(time);
    switch(grouping) {
      case 'sec':
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: false 
        });
      case 'min':
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      case 'hour':
        return date.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          hour12: false 
        });
      default:
        return date.toLocaleTimeString();
    }
  };

  // Predefined color palette for different lines
  const COLOR_PALETTE = {
    bufferPoolHitRatio: {
      'BP_1': '#FFA07A',
      'BP_2': '#20B2AA',
      'BP_3': '#9370DB',
      'BP_4': '#FFD700',
      'default': '#FF6384'
    },
    bufferPoolPhysicalReads: {
      'BP_1': '#4169E1',
      'BP_2': '#32CD32',
      'BP_3': '#8A2BE2',
      'BP_4': '#FF4500',
      'default': '#1E90FF'
    },
    swapUsage: {
      'in': '#008FD5',
      'out': '#71D8BD',
      'default': '#FF6384'
    },
    committedMemory: {
      'default': '#FF6384'
    }
  };

  // State declarations
  const [bufferPoolData, setBufferPoolData] = useState([
    {
      id: 'BP_1 Hit Ratio',
      color: COLOR_PALETTE.bufferPoolHitRatio['BP_1'],
      data: []
    },
    {
      id: 'BP_2 Hit Ratio',
      color: COLOR_PALETTE.bufferPoolHitRatio['BP_2'],
      data: []
    },
    {
      id: 'BP_1 Physical Reads',
      color: COLOR_PALETTE.bufferPoolPhysicalReads['BP_1'],
      data: []
    },
    {
      id: 'BP_2 Physical Reads',
      color: COLOR_PALETTE.bufferPoolPhysicalReads['BP_2'],
      data: []
    }
  ]);

  const [swapUsageData, setSwapUsageData] = useState([
    {
      id: 'Swap Pages In',
      color: COLOR_PALETTE.swapUsage['in'],
      data: []
    },
    {
      id: 'Swap Pages Out',
      color: COLOR_PALETTE.swapUsage['out'],
      data: []
    }
  ]);

  const [committedMemoryData, setCommittedMemoryData] = useState([
    {
      id: 'Committed Memory',
      color: COLOR_PALETTE.committedMemory['default'],
      data: []
    }
  ]);

  // Common State
  const [rows] = useState(25);
  const [grouping, setGrouping] = useState('sec');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() - 6);
    return now.toISOString().slice(0, 16);
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
      const bufferPoolTransformedData = rawData.bufferpools.flatMap(pool => [
        {
          id: `${pool.name} Hit Ratio`,
          color: COLOR_PALETTE.bufferPoolHitRatio[pool.name] || COLOR_PALETTE.bufferPoolHitRatio['default'],
          data: pool.hitratios.map((hitratio, index) => ({
            x: formatTimestamp(rawData.timestamps[index], grouping),
            y: parseFloat(hitratio || 0),
          })).reverse() // Reverse for right to left display
        },
        {
          id: `${pool.name} Physical Reads`,
          color: COLOR_PALETTE.bufferPoolPhysicalReads[pool.name] || COLOR_PALETTE.bufferPoolPhysicalReads['default'],
          data: pool.reads.physical_reads.map((reads, index) => ({
            x: formatTimestamp(rawData.timestamps[index], grouping),
            y: parseInt(reads || 0),
          })).reverse() // Reverse for right to left display
        }
      ]);
  
      // Transform Swap Usage Data
      const swapTransformedData = [
        {
          id: 'Swap In',
          color: COLOR_PALETTE.swapUsage['in'],
          data: rawData.timestamps.map((time, index) => ({
            x: formatTimestamp(time, grouping),
            y: rawData.swap_usage?.swap_pages_in?.[index] || 0,
          })).reverse() // Reverse for right to left display
        },
        {
          id: 'Swap Out',
          color: COLOR_PALETTE.swapUsage['out'],
          data: rawData.timestamps.map((time, index) => ({
            x: formatTimestamp(time, grouping),
            y: rawData.swap_usage?.swap_pages_out?.[index] || 0,
          })).reverse() // Reverse for right to left display
        }
      ];
  
      const committedMemoryTransformedData = [
        {
          id: 'C-Memory',
          color: COLOR_PALETTE.committedMemory['default'],
          data: rawData.timestamps.map((time, index) => ({
            x: formatTimestamp(time, grouping),
            y: rawData.committed_memory?.[index] || 0,
          })).reverse() // Reverse for right to left display
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
      width="100%"
    >
      <Box height="340px">
        {data[0].data.length > 0 && (
          <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 100, bottom: 40, left: 58 }}
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
            sortByValue={true} // Ensure right to left sorting
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
            <MenuItem value="uur">Hours</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {/* Buffer Pool Metrics - Now in two columns */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box mb={2} ml={2}>
              <h3 style={{ color: colors.grey[100], margin: 0 }}>Buffer Pool Hit Ratios</h3>
            </Box>
            {renderLineChart(
              bufferPoolData.filter(series => series.id.includes('Hit Ratio')), 
              true // Percentage scale
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Box mb={2} ml={2}>
              <h3 style={{ color: colors.grey[100], margin: 0 }}>Buffer Pool Physical Reads</h3>
            </Box>
            {renderLineChart(
              bufferPoolData.filter(series => series.id.includes('Physical Reads'))
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