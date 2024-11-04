import axios from 'axios';
export const getAllPerfumes = async () => {
    console.log("get all perfume!!!!!!!!!!!!!!!! from helpers");
    try {
      const res = await axios.get(`http://localhost:5000/perfume`);
  
      if (res.status !== 200) {
        console.log("No Data");
        return { movies: [] };
      }
      const data = await res.data;
      console.log("Data: ", data);
      return data;
    } catch (err) {
      console.log("Error: ", err.message);
      return { movies: [] };
    }
  };