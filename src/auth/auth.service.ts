import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcryptjs from 'bcryptjs';

import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Categoria } from './entities/categoria.entity';

import { CreateUserDto, RegisterUserDto, LoginDto, CreateProductoDto } from './dto/index';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/loginresponse';
import { CrearComentarioDto } from './dto/crear-comentario.dto';
import { Comentario } from './entities/comentario.entity';

@Injectable()
export class AuthService {

  constructor(

    private jwtService: JwtService,

    @InjectModel( User.name )
    private userModel: Model<User>,
    
    @InjectModel( Product.name )
    private productModel: Model<Product>,    

    @InjectModel( Categoria.name )
    private categoriaModel: Model<Categoria>,    
    
    @InjectModel( Comentario.name )
    private comentarioModel: Model<Comentario>,    
    
  ){}

  // AUTENTICACION, INGRESO, REGISTRO Y DATOS DE USUARIO

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {

      const { password, ... userData} = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });

      await newUser.save();
      const { password:_, ...user} = newUser.toJSON();

      return user;
      
    } catch (error){
      if(error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } ya existe`)
      }
      throw new InternalServerErrorException('Algo terrible ha sucedido!!!')
      
    }
  }

  async register( registerDto: RegisterUserDto): Promise<LoginResponse> {

    const user = await this.create(registerDto);

    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }

  async login( loginDto: LoginDto ): Promise<LoginResponse> {

    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if ( !user ||  !bcryptjs.compareSync( password, user.password )){
      throw new UnauthorizedException("Las credenciales no son validas");
    }

    const { password:_, ...rest} = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string ){

    const user = await this.userModel.findById( id );
    const { password, ...rest} = user.toJSON();
    return rest;

  }

  async update(id: string, createUserDto: CreateUserDto) {
    
    const { ... userData} = createUserDto;
      const newUser = new this.userModel({...userData});

      await newUser.updateOne();

  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign(payload);
    return token;

  }

  async getUserById(_id): Promise<User> {

    return this.userModel.findById(_id);
  }
  
  getUserId(_id): Promise<User> {
    return this.userModel.findById(_id);
  }


  // COMENTARIOS

  async crearComentario(crearComentarioDto: CrearComentarioDto): Promise<Comentario> {

    try {

      const { ...comentarioData } = crearComentarioDto;
      const newComentario = new this.comentarioModel({...comentarioData});

      await newComentario.save();

      return {
        _id: newComentario._id,
        email: newComentario.email,
        comentario: newComentario.comentario,
      }
      
    } catch (error){
      if(error.code === 11000 ) {
        throw new BadRequestException(`Esta cuenta ya ha escrito un comentario`)
      }
      throw new InternalServerErrorException('Algo terrible ha sucedido!!!')
      
    }
  }


  // CREACION, ACTUALIZACION Y BUSQUEDA DE PRODUCTOS

  async createProducto(createProductoDto: CreateProductoDto): Promise<Product> {

    const { ...productData } = createProductoDto;
    const newProduct = new this.productModel({...productData});

    newProduct.save();

    return {
      _id: newProduct._id,
      nombre: newProduct.nombre,
      precio: newProduct.precio,
      descripcion: newProduct.descripcion,
      categoria: newProduct.categoria,
      imagen: newProduct.imagen,
    }
  }

  productosByCategoria(_idCategoria: string): Promise<Product[]> {
    return this.productModel.find({'categoria': _idCategoria});
  }

  productoById(_id): Promise<Product> {
    return this.productModel.findById(_id);
  }


  // AGREGAR Y BUSCAR PRODUCTOS DEL CARRITO DEL USUARIO  

  async agregarAlCarrito( _idUser: string, _idProduct: string, user: User): Promise<User>{
    
    const newProduct = this.productoById(_idProduct);
    
    // const { ...productData } = createProductoDto;
    // const newProduct = new this.productModel({...productData});
    
    let { carrito: carritoUser, ...userData } = user;
    
    carritoUser.push(await newProduct)

    const newUser = this.userModel.findByIdAndUpdate(_idUser, 
      {
        carrito: carritoUser,
      },
      
      );

    return newUser

  }

  async getUserCarrito(_id: string): Promise<Product[]> {
    const user = this.getUserId(_id);
    
    const {carrito: carritoUser, ...userDara } = await user;
    return carritoUser;
  }


  // CREACION Y BUSQUEDA DE CATEGORÍAS

  async createCategoria(createCategoria): Promise<Categoria> {

    const { ...categoriaData} = createCategoria;

    const newCategoria = new this.categoriaModel({...categoriaData});

    newCategoria.save();

    return {
      _id: newCategoria._id,
      nombre: newCategoria.nombre,
      imagen: newCategoria.imagen,
    }
  }

  getCategorias(): Promise<Categoria[]> {
    return this.categoriaModel.find();
  }


}
