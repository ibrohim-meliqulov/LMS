import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule,
    JwtModule.register({
      secret: "shaftoli",
      signOptions: { expiresIn: "7d" }
    })
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
