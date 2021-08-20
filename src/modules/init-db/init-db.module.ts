import { Module } from '@nestjs/common';
import { InitDbService } from './init-db.service';
import { InitDbController } from './init-db.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { PostEntity } from '../../entities/post.entity';
import { CommentEntity } from '../../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity, CommentEntity])],
  providers: [InitDbService],
  controllers: [InitDbController],
})
export class InitDbModule {}
