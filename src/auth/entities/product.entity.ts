import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Product {

    _id?: string;

    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    precio: string;

    @Prop({ required: true })
    descripcion: string;

    @Prop({ maxlength: 30, required: true })
    categoria: string;

    @Prop({ required: true })
    imagen: string;


}


export const ProductSchema = SchemaFactory.createForClass( Product );
