export type UpdateUser = {
    userId: number,
    name: string,
    email: string,
    roleId: number
}

export type UpdatePassword = {
    userId: number,
    newPassword: string
}

export type DeleteUser = { 
    userId: number 
}