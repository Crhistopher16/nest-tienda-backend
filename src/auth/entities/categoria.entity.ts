import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Categoria {

    _id?: string;

    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    imagen: string;

}


export const CategoriaSchema = SchemaFactory.createForClass( Categoria );
