import { Box, useTheme, TextField, Button } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import React, {useState} from "react";
import MySearchComponent from "../../components/search_component";
import faqData from "./faqData";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchResults, setSearchResults] = useState(faqData);
  const handleSearch = (searchValue) => {
    console.log("Buscando:", searchValue);
    // Aquí puedes agregar la lógica para realizar la búsqueda
    // Por ejemplo, hacer una llamada a una API o filtrar datos locales
    const filteredResults = faqData.filter((item) =>
      item.question.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchValue.toLowerCase())
    );
    //setSearchResults(fakeResults); // Actualiza los resultados de búsqueda
    setSearchResults(filteredResults);
  };
  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
      <MySearchComponent onSearch={handleSearch} />
      {searchResults.map((item) => (
            <Accordion key={item.id} defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {item.answer.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;
