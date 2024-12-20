import { Box, FormControl, Select, MenuItem, TextField } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from '../../components/Header';
import { ResponsiveLine } from '@nivo/line';

const SpaceUsageChart = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { organization } = useLocation().state || {};
  const colors = tokens(theme.palette.mode);
  const { source } = useParams();
  const [data, setData] = useState([
    {
      id: 'Log Usage',
      color: '#008FD5',
      data: []
    },
    {
      id: 'Log Used',
      color: '#71D8BD',
      data: []
    }
  ]);
  const [rows] = useState(20);
  const [grouping, setGrouping] = useState('sec');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    // Subtract 6 hours from current time
    now.setHours(now.getHours() - 6);
    return now.toISOString().slice(0, 19);
  });

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
  
        const dateObj = new Date(startTime);
        const timezoneOffset = dateObj.getTimezoneOffset();
        const offsetSign = timezoneOffset > 0 ? '-' : '+';
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
  
        const formattedDateTime = dateObj.toISOString().slice(0, -1) + offsetSign + offsetHours + ':' + offsetMinutes;
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/metrics/${source}/transaction_log_space?start_time=${encodeURIComponent(
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
  
        if (!rawData || !rawData.times || !rawData.log_pct_usage || !rawData.total_log_used) {
          console.error('Invalid data format received:', rawData);
          return;
        }
  
        const transformedData = [
          {
            id: 'Log Usage',
            color: '#008FD5',
            data: rawData.times.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: parseFloat(rawData.log_pct_usage[index] || 0),
            })).reverse() // Reverse to go right to left
          },
          {
            id: 'Log Used',
            color: '#71D8BD',
            data: rawData.times.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: parseInt(rawData.total_log_used[index] || 0),
            })).reverse() // Reverse to go right to left
          }
        ];
  
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching Log data:', error);
      }
    };
  
    fetchLogData();
    const interval = setInterval(fetchLogData, 5000);
  
    return () => clearInterval(interval);
  }, [organization, source, startTime, rows, grouping]);

  return (
    <Box m="20px">
      <Header title="Log Space Usage" subtitle="Transaction Log Space" />
      
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

        <Box height="340px">
          {data[0].data.length > 0 && (
            <ResponsiveLine
              data={data}
              margin={{ top: 20, right: 140, bottom: 40, left: 40 }} 
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
              axisLeft={[
                {
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Log % Usage',
                  legendOffset: -40,
                  legendPosition: 'middle',
                  format: (value) => `${value}%`,
                },
                {
                  orient: 'right',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Total Log Used',
                  legendOffset: 40,
                  legendPosition: 'middle',
                }
              ]}
              colors={{ datum: 'color' }}
              pointSize={4}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              enableArea={true}
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
    </Box>
  );
};

export default SpaceUsageChart;