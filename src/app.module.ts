import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './global/guard/jwt-auth.guard';
import envConfig from 'config/envConfig';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        port: configService.get<number>('DB_PORT') ?? 3306,
        username: configService.get<string>('DB_USERNAME') ?? 'root',
        password: configService.get<string>('DB_PASSWORD') ?? '123456',
        database: configService.get<string>('DB_DATABASE') ?? 'nest-demo',
        synchronize: true,
        retryDelay: 500,
        retryAttempts: 10,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    NoteModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
