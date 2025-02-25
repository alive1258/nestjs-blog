import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import profileConfig from './users/config/profile.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/gaurds/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

// use created modules here

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,

    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, profileConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('database.host'),
        port: +ConfigService.get('database.port'),
        username: ConfigService.get('database.user'),
        password: ConfigService.get('database.password'),
        database: ConfigService.get('database.name'),
        autoLoadEntities: ConfigService.get('database.autoLoadEntities'),
        synchronize: ConfigService.get('database.synchronize'),
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
