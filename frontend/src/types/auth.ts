// request login 
export interface LoginRequest {
    username: string;
    password: string;
}

// response login 
export interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
        role: string;
    };

}

export type loginResponse = {
        token: string;
        user: user
}

export type user = {
    id: number;
    username: string;
    email: string;
}