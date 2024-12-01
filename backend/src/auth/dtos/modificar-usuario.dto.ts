import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { RolesEnum } from "../enums/roles.enum"

export class ModificarUsuarioDto {
    @IsOptional()
    @IsInt()
    idUsuario: number

    @IsOptional()
    @IsString()
    username: string

    @IsOptional()
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    nombre: string

    @IsOptional()
    @IsString()
    email: string

    @IsOptional()
    @IsString()
    imagen: string

    @IsOptional()
    @IsString()
    bio: string

    @IsOptional()
    rol: RolesEnum
}