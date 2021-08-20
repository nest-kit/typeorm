import { Module } from '@nestjs/common';
import { InitDbModule } from './modules/init-db/init-db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { UserEntity } from './entities/user.entity';
import { PostEntity } from './entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'typeorm_test',
      entities: [CommentEntity, UserEntity, PostEntity],
      synchronize: true,
    }),
    // 批量创建数据，查询数据
    // 内包含分批处理数据（通常会配合列队）
    InitDbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
