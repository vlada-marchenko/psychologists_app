import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://psychologists-app-d4d41-default-rtdb.firebaseio.com",
})

export default axiosClient