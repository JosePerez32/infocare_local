// Esto va en un archivo de servicios (api.js)
const fetchPerformanceData = async (source) => {
    try {
      const token = localStorage.getItem('accessToken');
      const organisation = localStorage.getItem('organization');
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/monitoring/source/performance`, 
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Esto es opcional para GET
            'organisation': organisation,
            'source': source
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
  
    } catch (error) {
      console.error("Error fetching performance data:", error);
      throw error; // Recomiendo crear un error personalizado aquí
    }
  };