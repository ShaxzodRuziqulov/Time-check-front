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
    id?: number
    username: string
    password?: string
    firstName: string
    lastName: string
    middleName: string
    birthDate: string
    userStatus: string
    jobId: number | string
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
    department: Department
}

export interface createJob {
    positionStatus: string
    jobStatus: string
    departmentId: number | string
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
    date: string
    user: UserData
}
export interface TimeTrackUser {
    id: number
    firstName: string
    lastName: string
    middleName: string
    startTime: string
    endTime: string
    userId: number
    delayReason: string
    endReason: string
    date: string
}

export interface Authority {
    authority: string
}

export interface UserData {
    createdAt: string
    updatedAt: string
    id: number | undefined
    firstName: string
    lastName: string
    middleName: string
    birthDate: string
    username: string | null
    password: string
    roles: Role[]
    job: Job
    userStatus: string
    enabled: boolean
    authorities: Authority[]
    accountNonExpired: boolean
    accountNonLocked: boolean
    credentialsNonExpired: boolean
}
export interface createTimeTrack {
    startTime?: string
    endTime?: string
    userId?: number | string | undefined
    delayReason?: string
    endReason?: string
    date?: string
    user?: UserData
}

export interface updateTimeTrack extends createTimeTrack {
    id?: number
    userId?: number | string
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
