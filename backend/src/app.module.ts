import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './modules/chat/chat.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
    }),

    // Conecta con la base de datos MongoDB, usando la URL de configuración
    MongooseModule.forRoot(
      process.env.MONGO_URI ?? 'mongodb://localhost:27017/chat_db'
    ),

    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],      
})
export class AppModule {}
