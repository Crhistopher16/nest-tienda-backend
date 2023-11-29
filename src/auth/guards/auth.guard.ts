import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private autService: AuthService
    ) {}


  async canActivate( context: ExecutionContext ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No hay token en la peticion.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, {secret: process.env.JWT_SEED}
      );

      const user = await this.autService.findUserById( payload.id );
      if ( !user ) throw new UnauthorizedException('El usuario no existe');
      if ( !user.isActive ) throw new UnauthorizedException('El usuario no esta activo');

      request['user'] = user;
      
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
