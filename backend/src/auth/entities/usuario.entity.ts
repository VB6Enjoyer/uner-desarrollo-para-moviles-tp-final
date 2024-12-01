import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from '../enums/roles.enum';

@Entity({ name: 'usuarios' })
export class Usuario {
    @PrimaryGeneratedColumn({ name: 'idUsuario' })
    idUsuario: number

    @Column({ name: 'username', length: 32 })
    username: string

    @Exclude()
    @Column({ name: 'password' })
    password: string

    @Column({ name: 'nombre' })
    nombre: string

    @Column({ name: 'email' })
    email: string

    @Column({ name: 'imagen' })
    imagen: string

    @Column({ name: 'bio', length: 1000 })
    bio: string

    @Column({ type: 'enum', enum: RolesEnum, name: 'rol' })
    rol: RolesEnum
}