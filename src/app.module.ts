import { Module } from '@nestjs/common';
import { InitDbModule } from './modules/init-db/init-db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { UserEntity } from './entities/user.entity';
import { PostEntity } from './entities/post.entity';
import { BasicModule } from './modules/basic/basic.module';
import { CommentRealEntity } from './entities/comment-real.entity';
import { UserRealEntity } from './entities/user-real.entity';
import { PostRealEntity } from './entities/post-real.entity';
import { RealModule } from './modules/real/real.module';

// 字段方式关联数据
const noRelations = [CommentEntity, UserEntity, PostEntity];
// 关联方式绑定多个实体
const hasRelations = [CommentRealEntity, UserRealEntity, PostRealEntity];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'typeorm_test',
      entities: [...noRelations, ...hasRelations],
      // 此选项会检查表与实体类的定义是否一致，当不存在表时候会自动创建表，当实体新增字段，会自动新增
      synchronize: true,
    }),
    // 批量创建数据，查询数据
    // 内包含分批处理数据（通常会配合列队）
    InitDbModule,
    BasicModule,
    RealModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
