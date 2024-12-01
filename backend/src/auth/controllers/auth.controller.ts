import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { AuthService } from "../services/auth.service";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    @Post('verify-token')
    async verifyToken(@Body('token') token: string) {
        return this.authService.verifyToken(token);
    }
}