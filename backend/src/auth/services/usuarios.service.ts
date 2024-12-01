import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "../entities/usuario.entity";
import { Repository } from "typeorm";
import { RolesEnum } from "../enums/roles.enum";
import { CrearUsuarioDto } from "../dtos/crear-usuario.dto";
import * as bcrypt from 'bcrypt';
import { ModificarUsuarioDto } from "../dtos/modificar-usuario.dto";

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private usuariosRepo: Repository<Usuario>) { }

  async obtenerUsuarios(): Promise<Usuario[]> {
    const usuarios: Usuario[] = await this.usuariosRepo.find({ select: ['idUsuario', 'username', 'password', 'nombre', 'email', 'bio', 'rol'] }); // Si cargan las imagenes revienta todo

    if (usuarios.length == 0) {
      throw new NotFoundException(
        'No existen usuarios en la base de datos.',
      );
    }

    return usuarios;
  }

  async obtenerUsuarioPorId(idUsuario: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({
      where: {
        idUsuario: idUsuario
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        'No existe un usuario con esta ID de usuario.',
      );
    }

    return usuario;
  }
  async obtenerUsuarioPorNombreDeUsuario(username: string): Promise<Usuario> {
    const usuario: Usuario = await this.usuariosRepo.findOne({
      where: {
        username: username
      }
    });

    if (!usuario) {
      throw new NotFoundException(
        'No existe un usuario con este nombre de usuario.',
      );
    }

    return usuario;
  }

  async obtenerUsuarioPorEmail(email: string): Promise<Usuario> {
    const usuario: Usuario = await this.usuariosRepo.findOne({
      where: {
        email: email
      }
    });

    if (!usuario) {
      throw new NotFoundException(
        'No existe un usuario con este email.',
      );
    }

    return usuario;
  }

  async obtenerUsuariosPorRol(rol: RolesEnum): Promise<Usuario[]> {
    const usuarios: Usuario[] = await this.usuariosRepo.find({
      where: {
        rol: rol,
      }
    });

    if (!usuarios || usuarios.length == 0) {
      throw new NotFoundException(
        'No se encontró ningún ' + rol.toString().toLowerCase + ' en la base de datos.',
      );
    }

    return usuarios;
  }

  async crearUsuario(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
    const usuario = new Usuario();

    usuario.username = crearUsuarioDto.username;
    usuario.password = await bcrypt.hash(crearUsuarioDto.password, 10);
    usuario.nombre = crearUsuarioDto.nombre;
    usuario.email = crearUsuarioDto.email;
    usuario.imagen = crearUsuarioDto.imagen;
    usuario.bio = crearUsuarioDto.bio;
    usuario.rol = crearUsuarioDto.rol;

    await this.usuariosRepo.save(usuario);

    return usuario;
  }

  async modificarUsuario(id: number, modificarUsuarioDto: ModificarUsuarioDto): Promise<Usuario> {
    const usuario: Usuario = await this.usuariosRepo.findOne({ where: { idUsuario: id } });

    if (!usuario) {
      throw new Error('No se encontró un usuario con la ID especificada.');
    }

    if (modificarUsuarioDto.username !== undefined) {
      usuario.username = modificarUsuarioDto.username;
    }

    if (modificarUsuarioDto.password !== undefined && String(modificarUsuarioDto.password).length > 0) {
      usuario.password = await bcrypt.hash(modificarUsuarioDto.password, 10);
    }

    if (modificarUsuarioDto.email !== undefined) {
      usuario.email = modificarUsuarioDto.email;
    }

    if (modificarUsuarioDto.imagen !== undefined && String(modificarUsuarioDto.imagen).length > 0) {
      usuario.imagen = modificarUsuarioDto.imagen;
    }

    if (modificarUsuarioDto.rol !== undefined && String(modificarUsuarioDto.rol).length > 0) {
      usuario.rol = modificarUsuarioDto.rol;
    }

    usuario.nombre = modificarUsuarioDto.nombre;
    usuario.bio = modificarUsuarioDto.bio;

    await this.usuariosRepo.save(usuario);

    return usuario;
  }

  async eliminarUsuario(id: number): Promise<void> {
    const usuario = await this.obtenerUsuarioPorId(id);

    if (!usuario) {
      throw new NotFoundException('No se encontró un usuario con el ID especificado.');
    }

    await this.usuariosRepo.remove(usuario);
  }
}