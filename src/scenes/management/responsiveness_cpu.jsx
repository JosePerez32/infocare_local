import { Box, FormControl, Select, MenuItem, TextField } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from '../../components/Header';
import { ResponsiveLine } from '@nivo/line';

const CpuUsageChart = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { organization } = useLocation().state || {};
  const colors = tokens(theme.palette.mode);
  const { source } = useParams();
  const [data, setData] = useState([
    {
      id: 'CPU User',
      color: '#008FD5',
      data: []
    },
    {
      id: 'CPU Idle',
      color: '#71D8BD',
      data: []
    },
    {
      id: 'CPU IO Wait',
      color: '#FFDE21',
      data: []
    },
    {
      id: 'CPU System',
      color: '#FFFFFF', // Changed to white
      data: []
    }
  ]);
  const [rows, setRows] = useState(120); // Increased rows for hours view
  const [grouping, setGrouping] = useState('sec');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 19);
  });

  useEffect(() => {
    const fetchCpuData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
  
        // Adjust start time based on grouping
        let adjustedStartTime = new Date(startTime);
        if (grouping === 'uur') {
          // Subtract 6 hours for hour view
          adjustedStartTime.setHours(adjustedStartTime.getHours() - 6);
        }
  
        const timezoneOffset = adjustedStartTime.getTimezoneOffset();
        const offsetSign = timezoneOffset > 0 ? '-' : '+';
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
  
        const formattedDateTime = adjustedStartTime.toISOString().slice(0, -1) + offsetSign + offsetHours + ':' + offsetMinutes;
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/metrics/${source}/cpu_usage?start_time=${encodeURIComponent(
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
  
        if (!rawData || !rawData.time || !rawData.cpu_user || !rawData.cpu_idle || !rawData.cpu_iowait || !rawData.cpu_system) {
          console.error('Invalid data format received:', rawData);
          return;
        }
  
        // Reverse the arrays to ensure left-to-right display
        const reversedTime = [...rawData.time].reverse();
        const reversedCpuUser = [...rawData.cpu_user].reverse();
        const reversedCpuIdle = [...rawData.cpu_idle].reverse();
        const reversedCpuIoWait = [...rawData.cpu_iowait].reverse();
        const reversedCpuSystem = [...rawData.cpu_system].reverse();
  
        const transformedData = [
          {
            id: 'CPU User',
            color: '#008FD5',
            data: reversedTime.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: parseFloat(reversedCpuUser[index] || 0),
            }))
          },
          {
            id: 'CPU Idle',
            color: '#71D8BD',
            data: reversedTime.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: parseFloat(reversedCpuIdle[index] || 0),
            }))
          },
          {
            id: 'CPU IO Wait',
            color: '#FFDE21',
            data: reversedTime.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: parseFloat(reversedCpuIoWait[index] || 0),
            }))
          },
          {
            id: 'CPU System',
            color: '#FFFFFF', // Changed to white
            data: reversedTime.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: parseFloat(reversedCpuSystem[index] || 0),
            }))
          }
        ];
  
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching CPU data:', error);
      }
    };
  
    // Adjust rows and refetch based on grouping
    if (grouping === 'sec') {
      setRows(10);
    } else if (grouping === 'min') {
      setRows(10);
    } else if (grouping === 'uur') {
      setRows(120); // 6 hours worth of data points
    }
  
    fetchCpuData();
    const interval = setInterval(fetchCpuData, 5000);
  
    return () => clearInterval(interval);
  }, [organization, source, startTime, grouping]);

  return (
    <Box m="20px">
      <Header title="CPU Usage" subtitle="System CPU Usage Distribution" />
      
      <Box 
        backgroundColor={colors.primary[400]}
        p="20px"
        width={"600px"}
        borderRadius="8px"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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

          <Box display="flex" gap="16px">
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

        <Box height="340px"  > 
          {data[0].data.length > 0 && (
            <ResponsiveLine
              data={data}
              margin={{ top: 20, right: 100, bottom: 40, left: 30 }} 
              xScale={{ type: 'point' }}
              yScale={{ 
                type: 'linear',
                min: 0,
                max: 100,
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
              enableArea={true}
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
    </Box>
  );
};

export default CpuUsageChart;