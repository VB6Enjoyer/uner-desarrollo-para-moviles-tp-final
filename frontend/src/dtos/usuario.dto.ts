import { RolesEnum } from "../enums/roles.enum";
import { UserStatusEnum } from "../enums/userStatus.enum";

export interface UserDto {
    idUsuario: number,
    username: string
    password: string,
    nombre?: string,
    email: string,
    imagen?: string,
    bio?: string,
    rol: string,
};

export const initUser: UserDto = {
    idUsuario: 0,
    username: '',
    password: '',
    nombre: '',
    email: '',
    imagen: '',
    bio: '',
    rol: '',
};