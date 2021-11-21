import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly mailerService: MailerService,
  ) {}

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    const userUpdate = await this.userRepository.findOne({
      email: forgotPasswordDto.email,
    });
    const passwordRand = Math.random()
      .toString(36)
      .slice(-8);
    userUpdate.password = bcrypt.hashSync(passwordRand, 8);

    this.sendMailForgotPassword(userUpdate.email, passwordRand);

    return await this.userRepository.save(userUpdate);
  }

  private sendMailForgotPassword(email, password): void {
    this.mailerService
      .sendMail({
        to: email,
        from: 'joshua9_14@hotmail.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        template: './index',
        context: {
          title: 'Forgot Password successful!',
          description:
            'Request Reset Password Successfully!  ✔, This is your new password: ' +
            password,
        },
      })
      .then(response => {
        console.log(response);
        console.log('Forgot Password: Send Mail successfully!');
      })
      .catch(err => {
        console.log(err);
        console.log('Forgot Password: Send Mail Failed!');
      });
  }
}
