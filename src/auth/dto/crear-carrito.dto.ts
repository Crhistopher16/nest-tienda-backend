import { IsString, MaxLength } from "class-validator";


export class CreateCarritoDto {

    @IsString()
    productos: string;

}