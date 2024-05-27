
import config from "../config";
import axios from "axios";


const http = axios.create({
    baseURL: `https://${config.amo.subdomain}.amocrm.ru/api/v4`,
    headers: {
        Authorization: `Bearer ${config.amo.token}`
    }
});




export const fetchLeads = async (query?: string) => http.get(query ? `/leads?with=contacts&query=${query}` : "/leads?with=contacts");

export const fetchUsers = async () => http.get("/users");

export const fetchContacts = async () => http.get("/contacts");

