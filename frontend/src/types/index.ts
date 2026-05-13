/** this file contains the typescript interfaces  */ 

export interface Group {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    role: string;
    phone: string | null;
    created_at: string;
    groups: Group[];
}

export interface EmployeeCreate {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    role: string;
    phone?: string; /**optional values are defined with this notation*/
}

export interface EmployeeUpdate {
    first_name?: string;
    last_name?: string;
    email?: string;
    department?: string;
    role?: string;
    phone?: string;
}

export interface GroupCreate {
    name: string;
    description?: string;
}



