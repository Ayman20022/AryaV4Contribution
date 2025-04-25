import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";

const httpClient = axios.create({
    baseURL: "http://localhost:8080/v1",
});

httpClient.interceptors.request.use(
    (config) => {        
        config.headers["Authorization"] = `Bearer ${localStorage.getItem("authToken")}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


httpClient.interceptors.response.use(
    (response) => {

        return response;
    },
    (error) => {
        if(error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem("authToken");
            }
        } else {
            toast.error("Network error. Please check your connection.");
        }

        return Promise.reject(error);
    }
);

export default httpClient;