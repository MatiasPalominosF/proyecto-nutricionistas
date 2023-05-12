import { Functionality } from "./functionalities.interface";

export interface User {
    uid?: string;
    password?: string;
    rut?: string;
    name?: string;
    lastName?: string;
    email?: string;
    createdAt?: any;
    updatedAt?: any;
    lastActivity?: any;
    enabled?: boolean;
    photoURL?: string;
    phone?: string;
    address?: string;
    functionalities?: Functionality;
    socialProfiles?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
    role?: string;
    permissions?: string[];
    registerNumber?: string;
}
