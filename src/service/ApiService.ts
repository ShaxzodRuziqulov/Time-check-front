import type {createDepartment} from "../models/ProjectModels.ts";
import axiosInstance from "../axios.ts";

export const ApiService = {
    async createDepartment(department: createDepartment) {
        const response = await axiosInstance.post(`/api/admin/department/create`, department)
        return response.data
    },
    async updateDepartment(id: number, data: createDepartment) {
        return await axiosInstance.put(`/api/admin/department/update/${id}`, data)
    },
    async getAllDepartments () {
        return await axiosInstance.get('/api/admin/department/activeDepartment')
    },
    async deleteDepartment(id: number) {
        return await axiosInstance.delete(`/api/admin/department/delete/${id}`)
    }
}