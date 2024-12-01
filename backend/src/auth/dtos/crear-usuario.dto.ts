import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { RolesEnum } from "../enums/roles.enum"

export class CrearUsuarioDto {
    @IsOptional()
    @IsInt()
    idUsuario: number

    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    nombre: string

    @IsNotEmpty()
    @IsString()
    email: string

    @IsOptional()
    @IsString()
    imagen: string

    @IsOptional()
    @IsString()
    bio: string

    @IsNotEmpty()
    rol: RolesEnum
}