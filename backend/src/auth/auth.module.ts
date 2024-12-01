import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './entities/usuario.entity'
import { UsuariosController } from './controllers/usuarios.controller';
import { AuthService } from './services/auth.service';
import { UsuariosService } from './services/usuarios.service';
import { AuthGuard } from './guards/auth.guards';

@Module({
    controllers: [AuthController, UsuariosController],
    providers: [AuthService, UsuariosService, AuthGuard],
    imports: [TypeOrmModule.forFeature([Usuario])],
    exports: [UsuariosService],
})
export class AuthModule { }