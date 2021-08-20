import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { PostRealEntity } from './post-real.entity';

// 关联实体
@Entity()
export class CommentRealEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  createTime: Date;

  // 多对一，需要对应表也有支持
  @ManyToOne(() => PostRealEntity, (post) => post.comments)
  post: PostRealEntity;

  // 多对多关联
  @ManyToMany(() => PostRealEntity)
  // 需要额外的表来存储关联数据
  @JoinTable()
  posts: PostRealEntity[];
}
