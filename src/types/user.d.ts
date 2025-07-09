export interface CreateUserDto {
    email: string;
    nickname: string;
    password: string;
    image?: string | null;
}

export interface PatchUserDto extends Partial<CreateUserDto> { };

export interface UserOutputDto {
    id: number;
    email: string;
    nickname: string;
    createdAt: Date;
    updatedAt: Date;
}
