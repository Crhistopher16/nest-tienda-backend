import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Carrito {

    _id?: string;

    @Prop({ required: true })
    productos: string;

}


export const ProductSchema = SchemaFactory.createForClass( Carrito );
