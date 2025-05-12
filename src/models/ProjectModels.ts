export interface LoginUser {
    username: string;
    password: string;
}


export interface createDepartment {
    name: string;
    status?: string;
    departmentStatus?: string;
}

export interface updateDepartment extends createDepartment {
    id: number
    status?: string
    departmentStatus?: string
}

export interface Department {
    id: number
    name: string
    status?: string
    departmentStatus?: string
}


export interface createUser {
    username: string
    password: string
    firstName: string
    lastName: string
    middleName: string
    birthDate: string
    userStatus: string
    jobId: number
    roles: Role[]
}

export interface updateUsers extends createUser {
    id: number
    roles: Role[]
}


export interface Job {
    id: number
    positionStatus: string
    jobStatus: string
    departmentId: number
}

export interface createJob {
    positionStatus: string
    jobStatus: string
    departmentId: number
}

export interface updateJob extends createJob {
    id?: number
}


export interface User {
    id: number
    username: string
    password: string
    firstName: string
    lastName: string
    middleName: string
    birthDate: string
    userStatus: string
    jobId: number
    createdAt: Date
    rolesId: number[]
    roles: Role[]
}


export interface Role {
    id: number
    name: string
    description: string
}


export interface TimeTrack {
    id: number
    startTime?: string
    endTime?: string
    userId: number
    delayReason: string
    endReason: string
}

export interface createTimeTrack {
    startTime?: string
    endTime?: string
    userId: number
    delayReason: string
    endReason: string
}

export interface updateTimeTrack extends createTimeTrack {
    id?: number
}


export interface TrackSettings {
    id: number
    fromTime: string
    toTime: string
    trackSettingsStatus: string
}

export interface createTrackSettings {
    fromTime: string
    toTime: string
    trackSettingsStatus: string
}

export interface updateTrackSettings extends createTrackSettings {
    id?: number
}