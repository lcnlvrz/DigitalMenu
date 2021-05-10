import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  DB_HOST2,
  DB_NAME2,
  DB_PASSWORD2,
  DB_PORT2,
  DB_USERNAME2,
  GMAIL_PASS,
  GMAIL_USER,
} from './config/constants';
import { AuthModule } from './modules/auth/auth.module';
import { CampaingModule } from './modules/campaing/campaing.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { ReportModule } from './modules/report/report.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { SurveyFormModule } from './modules/survey-form/survey-form.module';
import { TableModule } from './modules/table/table.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>(DB_HOST2),
        port: Number(config.get<string>(DB_PORT2)),
        database: config.get(DB_NAME2),
        username: config.get<string>(DB_USERNAME2),
        password: config.get<string>(DB_PASSWORD2),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: config.get<string>(GMAIL_USER),
            pass: config.get<string>(GMAIL_PASS),
          },
        },
        defaults: {
          from: '"digital-menu" <digital@menu.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    AuthModule,
    RestaurantModule,
    MenuModule,
    OrderModule,
    SurveyFormModule,
    CampaingModule,
    ReportModule,
    TableModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
