import { Box, Typography, Alert, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams, useLocation } from "react-router-dom";
import LineChart from '../../../components/LineChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Backups = ({onDataUpdate}) => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [backupData, setBackupData] = useState([
    {
      id: "Age",
      color: colors.greenAccent[500],
      data: [{ x: new Date().toString(), y: 0 }]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [grouping, setGrouping] = useState('hour');

  const [anchorElTime, setAnchorElTime] = useState(null);
  const [anchorElGroup, setAnchorElGroup] = useState(null);

  const fetchBackupData = async () => {
    try {
      setLoading(true);
      setError(null);
   
      const organisation = localStorage.getItem('organisation');
      const token = localStorage.getItem('accessToken');
      const now = new Date();
      const startTime = new Date();   
      
      switch(timeRange) {
        case '1h': startTime.setHours(now.getHours() - 1); break;
        case '24h': startTime.setDate(now.getDate() - 1); break;
        case '7d': startTime.setDate(now.getDate() - 7); break;
        case '30d': startTime.setDate(now.getDate() - 30); break;
        default: startTime.setDate(now.getDate() - 1);
      }

      const params = new URLSearchParams({
        start_time: startTime.toISOString(),
        rows: '100',
        grouping: grouping === 'hour' ? 'uur' : grouping
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/metrics/recoverability/backups?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'organisation': organisation,
            'source': databaseName
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      
      console.log("Backup data from API:", {
        timestamps: data.timestamps?.length || 0,
        age: data.age?.length || 0
      });

      transformDataForCharts(data);
      
    } catch (error) {
      console.error("Error fetching backup data:", error);
      setError("Failed to load backup data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const transformDataForCharts = (apiData) => {
    try {
      const safeData = {
        timestamps: Array.isArray(apiData?.timestamps) ? 
                   apiData.timestamps.filter(t => t !== null && t !== undefined) : [],
        age: Array.isArray(apiData?.age) ? 
             apiData.age.map(Number).filter(n => !isNaN(n)) : []
      };

      const minLength = Math.min(
        safeData.timestamps.length,
        safeData.age.length
      );

      const chartData = [
        {
          id: 'Age',
          color: colors.greenAccent[500],
          data: minLength > 0 ? 
               Array(minLength).fill().map((_, i) => ({
                 x: new Date(safeData.timestamps[i]).toLocaleString('en-US', {
                   month: 'short',
                   day: 'numeric',
                   year: 'numeric',
                   hour: '2-digit',
                   minute: '2-digit',
                   hour12: true
                 }),
                 y: safeData.age[i]
               })) : 
               [{ 
                 x: new Date().toLocaleString('en-US', {
                   month: 'short',
                   day: 'numeric',
                   year: 'numeric',
                   hour: '2-digit',
                   minute: '2-digit',
                   hour12: true
                 }), 
                 y: 0 
               }]
        }
      ];

      setBackupData(chartData);
    } catch (transformError) {
      console.error("Error transforming data:", transformError);
      setError("Data format error");
    }
  };

  useEffect(() => {
    fetchBackupData();
  }, [databaseName, timeRange, grouping]);

  return (
    <Box m="20px">
      <Header title={`Backups for ${databaseName}`} subtitle="" />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {/* Time Range Button */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElTime(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
          sx={{ minWidth: 150 }}
        >
          {timeRange === '1h' ? 'Last hour' : 
          timeRange === '24h' ? 'Last 24h' :
          timeRange === '7d' ? 'Last 7 days' : 
          timeRange === '30d' ? 'Last 30 days' : 'Time Range'}
        </Button>

        {/* Grouping Button */}
        <Button
          variant="contained"
          onClick={(e) => setAnchorElGroup(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
          sx={{ minWidth: 150 }}
        >
          {grouping === 'min' ? 'By minutes' :
          grouping === 'hour' ? 'By hours' : 
          grouping === 'day' ? 'By days' : 'Group by'}
        </Button>

        {/* Time Range Menu */}
        <Menu
          anchorEl={anchorElTime}
          open={Boolean(anchorElTime)}
          onClose={() => setAnchorElTime(null)}
        >
          {['1h', '24h', '7d', '30d'].map((range) => (
            <MenuItem 
              key={range} 
              onClick={() => setTimeRange(range)}
            >
              {range === '1h' ? 'Last hour' : 
              range === '24h' ? 'Last 24h' :
              range === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </MenuItem>
          ))}
        </Menu>

        {/* Grouping Menu */}
        <Menu
          anchorEl={anchorElGroup}
          open={Boolean(anchorElGroup)}
          onClose={() => setAnchorElGroup(null)}
        >
          {['min', 'hour', 'day'].map((group) => (
            <MenuItem 
              key={group}
              onClick={() => setGrouping(group)}
            >
              {group === 'min' ? 'By minutes' :
              group === 'hour' ? 'By hours' : 'By days'}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {loading && <Alert severity="info">Loading data...</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box height="300px" sx={{ minWidth: 0 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
          
        </Typography>
        <LineChart
          data={backupData}
          enableTooltip={true}
          yAxisLegend="Age (days)"
          xAxisLegend="Time"
        />
      </Box>
    </Box>
  );
};

export default Backups;