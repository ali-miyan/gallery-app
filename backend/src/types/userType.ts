import { Document } from "mongoose"

export interface userType extends Document {
    name:string
    email:string
    password:string
    imgUrl?:string
    isAdmin?:Boolean
}