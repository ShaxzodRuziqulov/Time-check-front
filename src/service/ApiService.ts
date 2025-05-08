import type {
    createDepartment,
    createJob,
    createTimeTrack,
    createUser,
    updateJob,
    updateTimeTrack,
    updateUsers
} from "../models/ProjectModels.ts";
import axiosInstance from "../axios.ts";

export const ApiService = {

    async createDepartment(department: createDepartment) {
        const response = await axiosInstance.post(`/api/admin/department/create`, department)
        return response.data
    }, async updateDepartment(id: number, data: createDepartment) {
        return await axiosInstance.put(`/api/admin/department/update/${id}`, data)
    }, async getAllDepartments() {
        return await axiosInstance.get('/api/admin/department/activeDepartment')
    }, async deleteDepartment(id: number) {
        return await axiosInstance.delete(`/api/admin/department/delete/${id}`)
    }, async countDepartment() {
        return await axiosInstance.get('/api/admin/department/count')
    },


    async createUser(user: createUser) {
        const response = await axiosInstance.post(`/api/admin/user/create`, user)
        return response.data
    }, async updateUser(id: number, user: updateUsers) {
        return await axiosInstance.put(`/api/admin/user/update/${id}`, user)
    }, async getAllUsers() {
        return await axiosInstance.get('/api/admin/user/activeUser')
    }, async deleteUser(id: number) {
        return await axiosInstance.delete(`/api/admin/user/delete/${id}`)
    }, async countUser() {
        return await axiosInstance.get('/api/admin/user/count')
    },async findOneUserId(id: number) {
        return await axiosInstance.get(`/api/admin/user/${id}`)
    },


    async createJob(job: createJob) {
        const response = await axiosInstance.post(`/api/admin/job/create`, job)
        return response.data
    }, async updateJob(id: number, job: updateJob) {
        return await axiosInstance.put(`/api/admin/job/update/${id}`, job)
    }, async getAllJobs() {
        return await axiosInstance.get('/api/admin/job/all')
    }, async deleteJob(id: number) {
        return await axiosInstance.delete(`/api/admin/job/delete/${id}`)
    }, async getPositions() {
        return await axiosInstance.get('/api/admin/job/positions')
    }, async countJob() {
        return await axiosInstance.get('/api/admin/job/count')
    }, async getAllRoles() {
        return await axiosInstance.get('/api/admin/role/roles')
    },


    async createTimeTrack(timeTrack: createTimeTrack) {
        const response = await axiosInstance.post(`/api/admin/time-track/create`, timeTrack)
        return response.data
    }, async updateTimeTrack(id: number, timeTrack: updateTimeTrack) {
        return await axiosInstance.put(`/api/admin/time-track/update/${id}`, timeTrack)
    }, async completeTimeTrack(id: number) {
        return await axiosInstance.get(`/api/admin/time-track/complete/${id}`)
    }, async findAll() {
        return await axiosInstance.get('/api/admin/time-track/all')
    }, async findById(id: number) {
        return await axiosInstance.get(`/api/admin/time-track/${id}`)
    }, async delete(id: number) {
        return await axiosInstance.delete(`/api/admin/time-track/delete/${id}`)
    }, async checkIfUserCanLeave(id: number) {
        return await axiosInstance.put(`/api/admin/time-track/check/${id}`)
    },


    async getActiveTrackSettings() {
        return await axiosInstance.get('/api/admin/track-settings/allActive')
    }
}