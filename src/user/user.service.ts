import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils/md5';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { error, log } from 'console';


@Injectable()
export class UserService {
  private logger = new Logger();

  @Inject(RedisService)
  private redisService: RedisService;

  
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;


  //注册
  async register(user: RegisterUserDto) {
    // 根据email来获取验证码
    const captcha = await this.redisService.get(`captcha_${user.email}`)

    //1. 如果没有
    if(!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    //2.如果验证码不对
    if(user.captcha != captcha) {
      throw new HttpException('验证吗不正确', HttpStatus.BAD_REQUEST);
    }

    // 3.mysql 中去查询
    const foundUser = await this.userRepository.findOneBy({
      username: user.username
    });
    // 4. 存在
    if(foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    // 5.不存在 保存 save
    const newUser = new User();
    newUser.username = user.username;
    // 密码需要hash
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickname = user.nickName;
    newUser.head_picture = 'default_picture.png';
    newUser.phone_number = 'default_string';

    try {
      await this.userRepository.save(newUser);
      return'注册成功';
    } catch(error) {
      this.logger.error(error,UserService);
      return '注册失败';
    }
  }

  初始化数据
  async initData() {
    // console.log("--------------------");
    const user1 = new User();
    user1.username = "zhangsan";
    user1.password = md5("111111");
    user1.email = "1185501562@qq.com";
    user1.isAdmin = true;
    user1.nickname = '张三';
    user1.phone_number = '13233323333';
    user1.head_picture = 'default.pic'
    
    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5("222222");
    user2.email = "333333333@qq.com";
    user2.nickname = '李四';
    user2.head_picture = 'default.pic'
    user2.phone_number = '144444444444'

    const role1 = new Role();
    role1.name = '管理员';
    console.log("++++++++role1:"+role1);
    

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];
    console.log("............................");
    console.log(role1);
    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
}

  // 登录
  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin 
      },
      relations: [ 'roles', 'roles.permissions' ]
    });
    // console.log(user);
    
    if(!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if(user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    // return user;
    console.log("----------------");
    const vo = new LoginUserVo();
    // console.log(user)
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickname,
      email: user.email,
      phoneNumber: user.phone_number,
      headPic: user.head_picture,
      createTime: user.createTime.getTime(),
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map(item => item.name),
      permissions: user.roles.reduce((arr, item) => {
          item.permissions.forEach(permission => {
              if(arr.indexOf(permission) === -1) {
                  arr.push(permission);
              }
          })
          return arr;
      }, [])
    }
    return vo;
  }

  // 实现findUserById方法
  async findUserById(userId: number, isAdmin: boolean) {
    const user =  await this.userRepository.findOne({
        where: {
            id: userId,
            isAdmin
        },
        relations: [ 'roles', 'roles.permissions']
    });

    return {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        roles: user.roles.map(item => item.name),
        permissions: user.roles.reduce((arr, item) => {
            item.permissions.forEach(permission => {
                if(arr.indexOf(permission) === -1) {
                    arr.push(permission);
                }
            })
            return arr;
        }, [])
    }
}
}
