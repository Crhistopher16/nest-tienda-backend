import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginDto, RegisterUserDto, CreateProductoDto, CreateCarritoDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/loginresponse';
import { User } from './entities/user.entity';
import { CreateCategoriaDto } from './dto/crear-categoria.dto';
import { CrearComentarioDto } from './dto/crear-comentario.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // USUARIOS

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('buscar-usuario/:_id')
  buscarUsuario(@Param('_id') _id: string, @Request() req: Request) {
    return this.authService.getUserId(_id);
  }

  @Post('/login')
  login( @Body() loginDto: LoginDto  ) {
    return this.authService.login( loginDto );
  }

  @Post('/register')
  register( @Body() registerDto: RegisterUserDto  ) {
    return this.authService.register( registerDto );
  }

  @UseGuards( AuthGuard )
  @Get('get-users')
  findAll( @Request() req: Request ) {
    // const user = req['user'];
    
    // return user;
    return this.authService.findAll();
  }

  // LoginResponse
  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ): LoginResponse {
      
    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }


  // COMENTARIOS

  @Post('create-comentario')
  crearComentario(@Body() crearComentarioDto: CrearComentarioDto ) {
    return this.authService.crearComentario(crearComentarioDto);
  }
  

  // PRODUCTOS

  @Post('create-product')
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    
    return this.authService.createProducto(createProductoDto);
  }

  @Get('obtener-productos/:_idCategoria')
  productos( @Param('_idCategoria') _idCategoria: string, @Request() req: Request ) {
    return this.authService.productosByCategoria(_idCategoria);
  }

  @Get('obtener-producto-by-id/:_id')
  getProductoById(@Param('_id') _id: string, @Request() req: Request) {
    return this.authService.productoById(_id);
  }

  
  // CARRITO

  @Post('agregar-carrito/:_idUser/:_idProducto')
  async agregarAlCarrito( @Param('_idUser') _idUser: string , @Param('_idProducto') _idProducto: string) {

    const user = await this.authService.getUserById(_idUser);

    return this.authService.agregarAlCarrito( _idUser, _idProducto, user);

  }

  @Get('carrito-usuario/:_idUser')
  async getCarritoUsuario( @Param('_idUser') _idUser: string ) {
    const carrito = await this.authService.getUserCarrito(_idUser);
    return carrito;
  }


  // CATEGORIAS

  @Post('create-categoria')
  createCategoria(@Body() createCategoria: CreateCategoriaDto) {
    
    return this.authService.createCategoria(createCategoria);
  }

  @Get('get-categorias')
  getCategorias( @Request() req: Request ) {
    return this.authService.getCategorias();
  }

}