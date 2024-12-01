import { Body, Controller, Get, Delete, Post, Put, Query, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guards';
import { Usuario } from '../entities/usuario.entity';
import { RolesEnum } from '../enums/roles.enum';
import { CrearUsuarioDto } from '../dtos/crear-usuario.dto';
import { ModificarUsuarioDto } from '../dtos/modificar-usuario.dto';

@Controller('/usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async obtenerUsuarios(): Promise<Usuario[]> {
    return await this.usuariosService.obtenerUsuarios();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('buscarPorId')
  async obtenerUsuarioPorId(@Query('id') idUsuario: number): Promise<Usuario> {
    return await this.usuariosService.obtenerUsuarioPorId(idUsuario);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('buscarPorUsername')
  async obtenerUsuarioPorNombreDeUsuario(@Query('username') username: string): Promise<Usuario> {
    return await this.usuariosService.obtenerUsuarioPorNombreDeUsuario(username);
  }

  @ApiBearerAuth()
  //@UseGuards(AuthGuard)
  @Get('buscarPorEmail')
  async obtenerUsuarioPorEmail(@Query('email') email: string): Promise<Usuario> {
    return await this.usuariosService.obtenerUsuarioPorEmail(email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('buscarPorRol')
  async obtenerUsuariosPorRol(@Query('rol') rol: RolesEnum): Promise<Usuario[]> {
    return await this.usuariosService.obtenerUsuariosPorRol(rol);
  }

  @ApiBearerAuth()
  //@UseGuards(AuthGuard)
  // * Authguard comentado para permitir crear usuarios al registrarse
  @Post()
  async crearUsuario(@Body() crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
    return await this.usuariosService.crearUsuario(crearUsuarioDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('modificarUsuario/:id')
  async modificarUsuario(@Param('id', ParseIntPipe) id: number, @Body() modificarUsuarioDto: ModificarUsuarioDto): Promise<Usuario> {
    return await this.usuariosService.modificarUsuario(id, modificarUsuarioDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('eliminarUsuario/:id')
  async eliminarUsuario(@Param('id') id: string): Promise<void> {
    const idParseada = parseInt(id, 10);
    await this.usuariosService.eliminarUsuario(idParseada);
  }
}