import { IsString, MaxLength } from "class-validator";


export class CreateProductoDto {

    @IsString()
    nombre: string;

    @IsString()
    precio: string;

    @IsString()
    descripcion: string;

    @IsString()
    @MaxLength(40)
    categoria: string;

    @IsString()
    imagen: string;

}