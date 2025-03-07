    import axios from "axios";

    // Base URL configuration
    export const BASE_URL = "http://127.0.0.1:8000/";

    // Create Axios instance with custom configuration
    export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: false, // If you need to send cookies or other credentials with requests
    timeout: 5000, // Optional: to set a timeout for requests
    });

    export const registerUser = async (formData) => {
        try {
        const response = await axiosInstance.post('/api/register', formData);
        return response.data.data;  // return the API response
        } catch (error) {
        console.error("Error during registration:", error.response);
        return error.response.data;  // throw the error response for handling in the component
        }
    };

    export const loginUser = async (formData) => {
        try {
            const response = await axiosInstance.post('/api/admin-login', formData);
            return response.data.data;  // return the API response
            
        } catch (error) {
            console.error("Error during login:", error);
            return error.response.data;  // throw the error response for handling in the component
        }
    }

    export const logoutUser = async (token) => {
        try {
            const response = await axiosInstance.post('/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; 
        } catch (error) {
            console.error("Error logging out", error);
            throw error.response ? error.response.data : error; 
        }
    };

    export const getUser = async (token) => {
        try {
        const response = await axiosInstance.get('/api/user', {
            headers: {
            Authorization: `Bearer ${token}`, 
            },
        });

        return response.data;  // Axios automatically returns data in `response.data`
        } catch (error) {
        console.error("Error fetching user data:", error);
        throw error.response ? error.response.data : error;  // Handle errors gracefully
        }
    };

    export const getDepartments = async () => {
        try{
            const response = await axiosInstance.get('/api/getDepartments');
            console.log(response.data.departments)
            return response.data.departments;
        }catch{
            console.error("Error fetching department data:", error);
            throw error
        }
    }

    export const getAllElections = async (token) => {
        try{
            const response = await axiosInstance.get('/api/elections', {
                headers: {
                Authorization: `Bearer ${token}`, 
                },
            });
            return response.data;
        }catch{
            console.error("Error fetching elections", error);
            throw error
        }
    }

    export const getAllRegistered = async (token) => {
        try{
            const response = await axiosInstance.get('/api/election/registered', {
                headers: {
                Authorization: `Bearer ${token}`, 
                },
            });
            return response.data;
        }catch{
            console.error("Error fetching registered voters", error);
            throw error
        }
    }

    export const getElectionById = async (token, id) => {
        try{
            const response = await axiosInstance.get(`/api/elections/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`, 
                },
            });
            return response.data;
        }catch{
            console.error("Error fetching election details", error);
            throw error
        }
    }

    export const getAllCandidates = async () => {
        try{
            const response = await axiosInstance.get(`/api/candidate/all`);
            console.log('reached function')
            return response.data;
        }catch{
            console.error("Error fetching candidates details", error);
            throw error
        }
    }

    export const getAllPositions = async () => {
        try{
            const response = await axiosInstance.get(`/api/positions/all`,);
            console.log('reached function')
            return response.data;
        }catch{
            console.error("Error fetching candidates details", error);
            throw error
        }
    }

    export const getAllPartylists = async (token) => {
        try{
            const response = await axiosInstance.get(`/api/partylists/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('reached function')
            return response.data;
        }catch{
            console.error("Error fetching candidates details", error);
            throw error
        }
    }


    export const getMakeElection = async (token, formData) => {
        try {
          const response = await axiosInstance.post('/api/elections/make', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          return response.data.data; // Return the data from the response if successful
        } catch (error) {
          // Check if the error has a response object (e.g., server responded with a status code)
          if (error.response) {
            console.error("Error during election creation:", error.response);
            return { success: false, message: error.response.data.message || 'An error occurred during election creation' };
          } else {
            // If no response (e.g., network error), handle it here
            console.error("Network or other error:", error);
            return { success: false, message: 'A network error occurred. Please try again later.' };
          }
        }
      };

    //register -> provide student_id, name, department, email, contact, -> unique id

