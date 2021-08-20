import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PostRealEntity } from './post-real.entity';

// 关联实体
@Entity()
export class UserRealEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  // 一对多
  @OneToMany(() => PostRealEntity, (post) => post.user)
  photos: PostRealEntity[];
}
