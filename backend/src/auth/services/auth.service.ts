import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { Usuario } from "../entities/usuario.entity";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UsuariosService } from "./usuarios.service";
import { firebaseAdmin } from '../../firebase/firebase-admin-config';
import { ServiceAccount } from "firebase-admin";

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService) {
    }

    async login(loginDto: LoginDto): Promise<{ token: string, idUsuario: number }> {
        const usuario: Usuario = await this.usuariosService.obtenerUsuarioPorEmail(loginDto.email);

        if (!usuario) {
            throw new BadRequestException("Email no válido.");
        }

        const claveCorrecta = await bcrypt.compare(
            loginDto.password.trim(),
            usuario.password.trim(),
        );

        if (!claveCorrecta) {
            throw new BadRequestException("Clave incorrecta.");
        }

        const token: string = this.jwtService.sign({
            sub: usuario.idUsuario,
            rol: usuario.rol,
        });

        const idUsuario = usuario.idUsuario;

        return {
            token,
            idUsuario
        };
    }

    async verifyToken(idToken: string) {
        const serviceAccount: ServiceAccount = require('../../firebase/adminsdk.json'); // Path to the Firebase Admin SDK private key
        try {
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount),
            });
        } catch (error) {
            console.error('Error initializing Firebase Admin SDK:', error);
        }

        try {
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
            return decodedToken; // You can return or use the decoded token information (e.g., uid, email, etc.)
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Invalid Firebase token', error);
        }
    }
} 