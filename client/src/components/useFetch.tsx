import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export interface FetchCalls {
    postJson: (url: string, body: any) => Promise<Response>;
    putJson: (url: string, body: any) => Promise<Response>;
    get: (url: string) => Promise<Response>;
    del: (url: string) => Promise<Response>;
}

// Helper functions for fetching. Each function adds the JWT for authorization and checks the return code for errors
export const useFetch = (): FetchCalls => {
    const auth = useAuth();
    const navigate = useNavigate();
    

    // If the user receives unauthorized when calling these functions, it means that there is an old token in the
    // browser storage. It will be deleted and the user will be redirected to the login page

    const resetToLogin = () => {
        auth?.onLogout();
        navigate("/login");
    }


    const sendJsonBody = async (url: string, body: any, method: string): Promise<Response> => {
        const res = await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${auth?.token}`
            }
        });
        if (res.status == 401) {
            resetToLogin();
        }
        return res;
    }

    const postJson = async (url: string, body: any): Promise<Response> => {
        return sendJsonBody(url, body, "POST");
    }

    const putJson = async (url: string, body: any): Promise<Response> => {
        return sendJsonBody(url, body, "PUT");
    }

    const get = async (url: string): Promise<Response> => {
        const res = await fetch(url, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${auth?.token}`
            }
        });
        if (res.status == 401) {
            resetToLogin();
        }
        return res;
    }

    const del = async (url: string): Promise<Response> => {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${auth?.token}`
            }
        });
        if (res.status == 401) {
            resetToLogin();
        }
        return res;
    }

    return {
        postJson,
        putJson,
        get,
        del
    } 
}