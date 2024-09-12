/* SetMetadata 是 NestJS 提供的工具，用于在类或方法上添加自定义的元数据。元数据不会直接影响业务逻辑，
但可以在守卫（Guards）或拦截器（Interceptors）中使用，
通过 Reflector 读取这些元数据，实现自定义的权限或身份验证逻辑
*/
import { SetMetadata } from "@nestjs/common"; 

// requireLogin装饰器：标记某个方法或者类，需要用户登陆才能访问
export const RequireLogin = () => SetMetadata( 'require-login', true );

// RequirePermission装饰器：标记某个方法或者类，需要特定 权限才能访问
export const RequirePermission = (...permission:string[]) => SetMetadata('require-permission', permission);