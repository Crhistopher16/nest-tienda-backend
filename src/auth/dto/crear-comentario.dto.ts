import { IsEmail, IsString } from "class-validator";


export class CrearComentarioDto {

    _id?: string;

    @IsEmail()
    email: string;

    @IsString()
    comentario: string;

}
