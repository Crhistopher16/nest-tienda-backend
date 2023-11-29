import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Comentario {

    _id?: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    comentario: string;

}


export const ComentarioSchema = SchemaFactory.createForClass( Comentario );
