import { object, string, size, partial, define, optional } from 'superstruct';
import isEmail from 'is-email';

const Email = define<string>('Email', (value: unknown): value is string => {
    return typeof value === 'string' && isEmail(value);
});

export const CreateUser = object({
    email: Email,
    nickname: size(string(), 1, 15),
    password: size(string(), 6, 15),
    image: optional(string())
});

export const PatchUser = partial(CreateUser);

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
