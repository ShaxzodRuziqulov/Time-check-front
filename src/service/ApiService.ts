import type {
    createDepartment,
    createJob,
    createTimeTrack,
    createTrackSettings,
    createUser,
    updateJob,
    updateTimeTrack,
    updateTrackSettings,
    updateUsers
} from "@/models/ProjectModels";
import axiosInstance from "@/axios";

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
    }, async findOneUserId(id: number) {
        return await axiosInstance.get(`/api/admin/user/${id}`)
    },


    async createJob(job: createJob) {
        const response = await axiosInstance.post(`/api/admin/job/create`, job)
        return response.data
    }, async updateJob(id: number, job: updateJob) {
        return await axiosInstance.put(`/api/admin/job/update/${id}`, job)
    }, async getAllJobs() {
        return await axiosInstance.get('/api/admin/job/all')
    }, async getFreeJobs() {
        return await axiosInstance.get('/api/admin/job/free')
    },
    async deleteJob(id: number) {
        return await axiosInstance.delete(`/api/admin/job/delete/${id}`)
    }, async getPositions() {
        return await axiosInstance.get('/api/admin/job/positions')
    }, async countJob() {
        return await axiosInstance.get('/api/admin/job/count')
    }, async getAllRoles() {
        return await axiosInstance.get('/api/admin/role/roles')
    },


    async createTimeTrack(timeTrack: createTimeTrack) {
        const response = await axiosInstance.post(`/api/user/time-track/create`, timeTrack)
        return response.data
    },
    async createReasons(timeTrack: createTimeTrack) {
        const response = await axiosInstance.post(`/api/user/time-track/reason`, timeTrack)
        return response.data
    },
    async updateTimeTrack(id: number, timeTrack: updateTimeTrack) {
        return await axiosInstance.put(`/api/user/time-track/update/${id}`, timeTrack)
    }, async completeTimeTrack(id: number) {
        return await axiosInstance.get(`/api/user/time-track/complete/${id}`)
    }, async findAllTimeTracks() {
        return await axiosInstance.get('/api/user/time-track/all')
    }, async findById(id: number) {
        return await axiosInstance.get(`/api/user/time-track/${id}`)
    }, async deleteTimeTrack(id: number) {
        return await axiosInstance.delete(`/api/user/time-track/delete/${id}`)
    }, async getAllWithUserDetails() {
        return await axiosInstance.get('/api/user/time-track/users')
    }, async checkIfUserCanLeave(id: number) {
        return await axiosInstance.put(`/api/user/time-track/check/${id}`)
    },


    async createTrackSettings(track: createTrackSettings) {
        const response = await axiosInstance.post(`/api/admin/track-settings/create`, track)
        return response.data
    },
    async updateTrackSettings(id: number, track: updateTrackSettings) {
        return await axiosInstance.put(`/api/admin/track-settings/update/${id}`, track)
    },
    async getActiveTrackSettings() {
        return await axiosInstance.get('/api/admin/track-settings/allActive')
    }, async findByTrackSettings(id: number) {
        return await axiosInstance.get(`/api/admin/track-settings/${id}`)
    }, async deleteActiveTrackSettings(id: number) {
        return await axiosInstance.delete(`/api/admin/track-settings/delete/${id}`)
    }

}
