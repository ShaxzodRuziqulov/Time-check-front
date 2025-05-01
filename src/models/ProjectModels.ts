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
    birthDate: Date
    userStatus: string
    jobId: number
}

export interface updateUsers extends createUser {
    id: number
}
export interface Job{
    id: number
    positionStatus: string
    jobStatus: string
    departmentId: number
}