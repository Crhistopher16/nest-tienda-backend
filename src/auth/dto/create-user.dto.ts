import { IsEmail, IsString, MinLength } from "class-validator";
import { Product } from "../entities/product.entity";


export class CreateUserDto {

    _id?: string;

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

    carrito?: Product[];

}
