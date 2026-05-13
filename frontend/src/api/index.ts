/** This file contains all the http calls and your components never call axios directly */


import axios from 'axios';
import {Employee, EmployeeCreate, EmployeeUpdate, Group, GroupCreate} from '../types';


// points to FastAPI backend
// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001/';
const API_BASE = process.env.REACT_APP_API_URL || '/api';

const API = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// create Employee API calls

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await API.get(`/employees/`);
    return response.data;
};

export const getEmployee = async (id: string): Promise<Employee> => {
    const response = await API.get(`/employees/${id}`);
    return response.data;
};

export const createEmployee = async (employee: EmployeeCreate): Promise<Employee> => {
    const response = await API.post(`/employees/`, employee);
    return response.data;
};

export const updateEmployee = async (id: string, employee: EmployeeUpdate): Promise<Employee> => {
    const response = await API.put(`/employees/${id}`, employee);
    return response.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
    await API.delete(`/employees/${id}`);
};

export const addEmployeeToGroup = async (
  employeeId: string,
  groupId:    string
): Promise<Employee> => {
  const response = await API.post(`/employees/${employeeId}/groups/${groupId}`);
  return response.data;
};

export const removeEmployeeFromGroup = async (
  employeeId: string,
  groupId:    string
): Promise<Employee> => {
  const response = await API.delete(`/employees/${employeeId}/groups/${groupId}`);
  return response.data;
};

// create group api calls
export const getGroups = async(): Promise<Group[]> => {
    const response = await API.get(`/groups/`);
    return response.data;
};

export const createGroup = async(group: GroupCreate): Promise<Group> =>{
    const response = await API.post(`/groups/`, group);
    return response.data;
};

export const deleteGroup = async(id: string): Promise<void> => {
    await API.delete(`/groups/${id}`);
};

export const getGroupMembers = async(id: string): Promise<Employee[]> => {
    const response = await API.get(`/groups/${id}/members`);
    return response.data;
};



