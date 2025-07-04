export interface User {
    id: number;
    email: string;
    nickname: string;
    image?: string;
    createdAt: Date;
    updatedAt?: Date;
    password?: string;
}

export interface HttpError extends Error {
    status?: number;
    statusCode?: number;
    expose?: boolean;
}

export type UpdateUser = Partial<User>;