import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './entities/user.entity';
import { Product, ProductSchema } from './entities/product.entity';
import { Categoria, CategoriaSchema } from './entities/categoria.entity';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Product.name,
        schema: ProductSchema
      },
      {
        name: Categoria.name,
        schema: CategoriaSchema
      },
      {
        name: Comentario.name,
        schema: ComentarioSchema
      }
    ]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' },
    }),
  ]
})
export class AuthModule {}
