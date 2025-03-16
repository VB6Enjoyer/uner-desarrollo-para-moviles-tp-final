import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || "username",
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'desarrollo_movil',
      autoLoadEntities: true,
      synchronize: false,
      logger: 'advanced-console'
    }),
    AuthModule,
    JwtModule.register({
      global: true,
      secret: 'utn',
      signOptions: {
        expiresIn: '24h'
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }