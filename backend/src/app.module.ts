import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'username',
      password: 'password',
      database: 'desarrollo_movil',
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