import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          How can you change the sequence of the gauge curves ?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Drag en Drop te gauge where you want and this will be the sequence going forward. This is a personal setting.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Are there different types of users that can access Infocare?          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Yes, there are 2 types of users:
          <br></br>Guest : can see monitoring and environment and can create and follow up support tickets.
          <br></br>Administrators : has the same possibility’s as the quest but is also able to
          <br></br>Add/change/delete users
          <br></br>Retrieve ILMT reports
          <br></br>Retrieve Quarter reports
          <br></br>Change configuration settings
 
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Can I exclude tables/Indexes/Views for the comparisons between environments?         </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          An administrator can exclude tables and schema’s in the configuration section. This does have a effect for all users and can be specified per environment.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Can I request a comparison between environments per schema?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            No, comparisons are always made for all schema’s in the database.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Can I make exclusions resulting in less objects?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Yes, an administrator can set rules at a database level of objects that will not be counted in the objects section. These settings will be valid for all quests and is not a personal setting but and environment setting.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What are the values for the CPU graph?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The overall processor usage on this host including kernel processing time, expressed as a percentage.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          What are the values for the CPU wait graph?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
              Time spent waiting for IO (Linux, UNIX); time spent receiving and servicing hardware interrupts (Windows), expressed in processor ticks. Reported for Windows, AIX and Linux systems only. This measurement represents the aggregate for all processors on the system.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is the “SWAP” graph?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The number of pages swapped out to disk since system startup. Reported for AIX® and Linux® systems only.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is the BP Hitratio” graph?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Bufferpool hitratio expressed in percentage.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is the BP Read” graph?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Summ of all bufferpool read pages per minute.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is the “TS Read” graph?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Indicates the total amount of time spent reading in data and index pages from the table space containers (physical) for all types of table spaces. This value is given in milliseconds.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is the “TS Write” graph?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Cumulative elapsed time for each write to complete.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What does the “UID STMTS” graph represent?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The number of UPDATE, INSERT, MERGE and DELETE statements that were executed per interval of 15 seconds.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What does the “Select STMTS” graph represent?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The number of SQL SELECT statements that were executed per interval of 15 seconds.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Whats does the “Rows” graph represent?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The rows_returned monitor element is the number of rows that have been selected and returned to the application per interval of 15 seconds. 
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What does the “Cache” graph represent?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The total number of times that a requested section was not available for use and had to be loaded into the package cache. This count includes any implicit prepares performed by the system.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Whats does WL processing” represent?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The total amount of time spent working on requests. This value is reported in milliseconds.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Whats does the “WL Wait” graph represent?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The total time spent waiting within the database server. The value is in milliseconds.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What does the “WL Lock” graph represent?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The number of times that a request to lock an object timed out instead of being granted.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What does the “WL Deadlocks” graph represent?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The total number of deadlocks that have occurred per interval of 15 seconds.
          <br></br>
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      
      
     
    </Box>
  );
};

export default FAQ;
