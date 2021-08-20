import { Module } from '@nestjs/common';
import { RealController } from './real.controller';
import { RealService } from './real.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRealEntity } from '../../entities/comment-real.entity';
import { UserRealEntity } from '../../entities/user-real.entity';
import { PostRealEntity } from '../../entities/post-real.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentRealEntity,
      UserRealEntity,
      PostRealEntity,
    ]),
  ],
  controllers: [RealController],
  providers: [RealService],
})
export class RealModule {}
