import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserRealEntity } from './user-real.entity';
import { CommentRealEntity } from './comment-real.entity';

// 关联实体
@Entity()
export class PostRealEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  content: string;

  // 一对一
  @OneToOne(() => UserRealEntity)
  // 本表字段关联，会创建一个额外字段存储信息
  @JoinColumn()
  user: UserRealEntity;

  // 一对多，需要对应表也有支持
  @OneToMany(() => CommentRealEntity, (comment) => comment.post)
  comments: CommentRealEntity[];
}
