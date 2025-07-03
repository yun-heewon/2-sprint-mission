export interface User {
    id: number;
    email: string;
    nickname: string;
    image?: string;
    createdAt: Date;
    updatedAt?: Date;
    password?: string;
}

export type UpdateUser = Partial<User>;