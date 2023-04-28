export interface User {
    uid?: string;
    password?: string;
    name?: string;
    lastName?: string;
    email?: string;
    createdAt?: any;
    enabled?: boolean;
    photoURL?: string;
    phone?: string;
    address?: string;
    socialProfiles?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
    role?: string;
    permissions?: string[];
    lastActivity?: any;
}
