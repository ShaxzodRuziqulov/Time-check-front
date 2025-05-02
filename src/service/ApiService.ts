import type {createDepartment, createJob, createUser, updateJob, updateUsers} from "../models/ProjectModels.ts";
import axiosInstance from "../axios.ts";

export const ApiService = {
    async createDepartment(department: createDepartment) {
        const response = await axiosInstance.post(`/api/admin/department/create`, department)
        return response.data
    },
    async updateDepartment(id: number, data: createDepartment) {
        return await axiosInstance.put(`/api/admin/department/update/${id}`, data)
    },
    async getAllDepartments() {
        return await axiosInstance.get('/api/admin/department/activeDepartment')
    },
    async deleteDepartment(id: number) {
        return await axiosInstance.delete(`/api/admin/department/delete/${id}`)
    },

    async createUser(user: createUser) {
        const response = await axiosInstance.post(`/api/admin/user/create`, user)
        return response.data
    }, async updateUser(id: number, user: updateUsers) {
        return await axiosInstance.put(`/api/admin/user/update/${id}`, user)
    },
    async getAllUsers() {
        return await axiosInstance.get('/api/admin/user/activeUser')
    }, async deleteUser(id: number) {
        return await axiosInstance.delete(`/api/admin/user/delete/${id}`)
    },

    async createJob(job: createJob) {
        const response = await axiosInstance.post(`/api/admin/job/create`, job)
        return response.data
    },
    async updateJob(id: number, job: updateJob) {
        return await axiosInstance.put(`/api/admin/job/update/${id}`, job)
    },
    async getAllJobs() {
        return await axiosInstance.get('/api/admin/job/all')
    },
    async deleteJob(id: number) {
        return await axiosInstance.delete(`/api/admin/job/delete/${id}`)
    }
}