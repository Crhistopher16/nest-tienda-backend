import { IsString, MaxLength } from "class-validator";


export class CreateCategoriaDto {

    @IsString()
    nombre: string;

    @IsString()
    categoria: string;

    @IsString()
    imagen: string;

}