import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from '../../entities/comment.entity';
import { PostEntity } from '../../entities/post.entity';

@Injectable()
export class BasicService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
    @InjectRepository(CommentEntity)
    private commentEntityRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private postEntityRepository: Repository<PostEntity>,
  ) {}

  // 添加
  createPost(content: string) {
    const post = new PostEntity();
    post.content = content;
    post.userId = 1;
    post.title = '固定标题';
    post.description = '固定介绍';
    return this.postEntityRepository.save(post);
  }

  // 删除
  delete(postId: number) {
    return this.postEntityRepository.delete({
      id: postId,
    });
  }

  // 根据用户查找所有的文章
  findUserPost(userId: number) {
    return this.postEntityRepository.find({
      userId: userId,
    });
  }

  // 删除用户所有文章
  deleteUserAllPost(userId: number) {
    return new Promise((resolve) => {
      // 查询用户所有文章
      this.postEntityRepository
        .find({
          userId: userId,
        })
        .then((posts) => {
          // 遍历所有文章
          const deletePosts = posts.map((post) => {
            return this.delete(post.id);
          });

          // 等待删除完成
          Promise.all(deletePosts).then((result) => {
            // 返沪删除结果
            resolve(result);
          });
        });
    });
  }

  // 清理用户相关的所有数据
  async banUser(userId: number) {
    const posts = await this.postEntityRepository.delete({
      userId: userId,
    });
    const comments = await this.commentEntityRepository.delete({
      userId: userId,
    });
    const user = await this.userEntityRepository.delete({ id: userId });

    return {
      posts,
      comments,
      user,
    };
  }
}
