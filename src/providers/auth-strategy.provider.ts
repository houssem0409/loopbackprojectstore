import { Provider , inject , ValueOrPromise } from "@loopback/context";
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import * as _jsonwebtoken from "jsonwebtoken"
const _ = require('lodash');
const jsonwebtoken = <any>_jsonwebtoken
import { Strategy  } from "passport";
import {
    AuthenticationBindings,
    AuthenticationMetadata,
    
  } from "@loopback/authentication";
  import {UserProfile} from "@loopback/security"
import { BasicStrategy } from "passport-http";
import { UserRepository } from "../repositories";
import { repository } from "@loopback/repository";
// import { myUserProfileFactory } from "./my.userprofile.factory";

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {

    constructor(
        @repository(UserRepository) public userRepository : UserRepository,
        @inject(AuthenticationBindings.METADATA)
        private metadata : AuthenticationMetadata,
    ){

    }

    value(): ValueOrPromise<Strategy | undefined> {
        console.log("hello");
        
        if(!this.metadata){
            return undefined
        }

        const name = this.metadata.strategy;
        if(name === 'BearerStrategy'){
            return new BearerStrategy(this.verify2.bind(this));

        }else{
            return Promise.reject(`the Strategy ${name} is not available`);

        }
    }

    verify(
        token : String,
        cb : (err : Error | null , user? : object | false) => void,
    ){

    }
    verify2(
        token : String,
        cb : (err : Error | null , user? : object | false) => void,
    ){

        try {
            const user = jsonwebtoken.verify(token , 'hzouhel');
            console.log(user);
            cb(null , user)
            
        } catch (ex) {
            cb(null , false)
            
        }
    }
}