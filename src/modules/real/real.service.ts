import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRealEntity } from '../../entities/user-real.entity';
import { CommentRealEntity } from '../../entities/comment-real.entity';
import { PostRealEntity } from '../../entities/post-real.entity';

@Injectable()
export class RealService {
  constructor(
    @InjectRepository(UserRealEntity)
    private userRealEntityRepository: Repository<UserRealEntity>,
    @InjectRepository(CommentRealEntity)
    private commentRealEntityRepository: Repository<CommentRealEntity>,
    @InjectRepository(PostRealEntity)
    private postRealEntityRepository: Repository<PostRealEntity>,
  ) {}

  // 用户实体必须存在
  // 创建指定用户的文章
  createPostByUser(user: UserRealEntity, postContent: string) {
    const post = new PostRealEntity();
    post.content = postContent;
    post.user = user;
    post.title = 'title';
    post.description = 'desc';
    post.comments = [];

    return this.postRealEntityRepository.save(post);
  }

  // 一对多 关联关系查询数据
  findUserAllPost(userId: number) {
    return this.userRealEntityRepository.find({
      where: { id: userId },
      // 加载关系
      relations: ['posts'],
    });
  }

  // 一对一 关联关系查询数据
  findPostUser(postId: number) {
    return this.postRealEntityRepository.find({
      where: { id: postId },
      // 加载关系
      relations: ['user'],
    });
  }
}
