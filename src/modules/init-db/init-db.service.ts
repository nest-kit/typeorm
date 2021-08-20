import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { PostEntity } from '../../entities/post.entity';
import { CommentEntity } from '../../entities/comment.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

// 初始化数据模块
@Injectable()
export class InitDbService {
  // 注入 typeorm 操作方法
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
    @InjectRepository(CommentEntity)
    private commentEntityRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private postEntityRepository: Repository<PostEntity>,
  ) {}

  initAll() {
    return new Promise((resolve) => {
      this.initUser().then(() => {
        this.initPost().then(() => {
          this.initComments().then(() => {
            resolve('所有数据创建完成');
          });
        });
      });
    });
  }

  // 一次性循环方式
  async initUser() {
    // 循环创建 1000 个用户, 将异步全部临时存储
    const users = [...new Array(1000)].map((_, index) => {
      Logger.log(`创建用户 ${index}`);
      const user = new UserEntity();
      user.isActive = faker.datatype.boolean();
      user.firstName = faker.name.firstName();
      user.lastName = faker.name.lastName();

      // save 返回了一个异步
      return this.userEntityRepository.save(user);
    });
    // 等待所有用户添加完成
    return await Promise.all(users);
  }

  // 随机一个用户
  async getRandomUser() {
    return this.userEntityRepository
      .createQueryBuilder()
      .orderBy('RAND()')
      .getOne();
  }

  // 分批处理数据方式
  // 因为是分批处理，这里返回是一个多维数组
  async initPost(): Promise<PostEntity[][]> {
    const numbers: number[] = [...new Array(300)].map((_, index) => index + 1);
    const allChunks = _.chunk(numbers, 100);

    const bathResult = allChunks.map(async (batch, index) => {
      Logger.log(`批数 ${index + 1} 开始封装实体`);
      const posts = batch.map(async (id) => {
        // Logger.log(`批数 ${index + 1} 创建文章 ${id} `);
        const post = new PostEntity();
        post.id = id;
        post.title = faker.name.title();
        post.description = faker.lorem.sentences();
        post.content =
          faker.lorem.paragraphs() + '\r\n' + faker.lorem.paragraphs();
        const user = await this.getRandomUser();
        if (user) {
          post.userId = user.id;
        }
        return post;
      });
      Logger.log(`批数 ${index + 1} 封装实体完成`);

      // 等待所有的异步完成，获取到实际用户实体

      Logger.log(`批数 ${index + 1} 等待实体全部处理完成`);
      const allPostData = await Promise.all(posts);
      Logger.log(`批数 ${index + 1} 实体全部处理完成`);

      // 保存当前批次的用户实体
      Logger.log(`批数 ${index + 1} 等待执行完成`);
      const datas = await this.postEntityRepository.save(allPostData);
      Logger.log(`批数 ${index + 1} 执行完成`);
      return datas;
    });

    // 等待批次数据全部处理完成
    return await Promise.all(bathResult);
  }

  async initComments() {
    // 给所有文章添加评论
    return this.postEntityRepository.find({ where: {} }).then(async (posts) => {
      Logger.log('开始添加评论，请稍后');
      // 所有评论
      const allComments = posts.map((post) => {
        return new Promise((resolve) => {
          // 给单个文章添加任意评论
          const comments = faker.datatype.number(5);
          Logger.log(`批量处理文章 ${post.id} 评论`);
          const postComments = [...new Array(comments)].map((_, index) => {
            return new Promise<CommentEntity>((resolveComment) => {
              Logger.log(`拼接评论实体 POST ${post.id} INDEX ${index + 1}`);
              this.getRandomUser().then((user) => {
                Logger.log(
                  `拼接评论实体 USER ${user.id} POST ${post.id} INDEX ${
                    index + 1
                  }`,
                );
                const comment = new CommentEntity();
                comment.content = faker.lorem.sentence();
                comment.createTime = faker.date.between(
                  new Date(2000, 1, 1, 1, 1, 1, 1),
                  new Date(2021, 10, 10, 10, 10, 10, 10),
                );
                comment.userId = user.id;
                comment.postId = post.id;

                this.commentEntityRepository.save(comment).then((save) => {
                  Logger.log(
                    `文章 ${post.id} 创建 ${comments} 个评论 第 ${index} 个 创建完成`,
                  );
                  resolveComment(save);
                });
              });
            });
          });

          // 等待所有评论创建完成
          Promise.all(postComments).then((results) => {
            resolve(results);
          });
        });
      });
      // 等待所有文章的评论创建完成
      return await Promise.all(allComments);
    });
  }
}
