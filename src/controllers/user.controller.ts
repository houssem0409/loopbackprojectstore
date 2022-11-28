


// // Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// // Node module: @loopback/example-todo-jwt
// // This file is licensed under the MIT License.
// // License text available at https://opensource.org/licenses/MIT

// import {authenticate, TokenService} from '@loopback/authentication';
// import {
//   Credentials,
//   MyUserService,
//   TokenServiceBindings,
//   User,
//   UserRepository,
//   UserServiceBindings,
// } from '@loopback/authentication-jwt';
// import {inject} from '@loopback/core';
// import {model, property, repository} from '@loopback/repository';
// import {
//   get,
//   getModelSchemaRef,
//   post,
//   requestBody,
//   SchemaObject,
// } from '@loopback/rest';
// import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
// import {genSalt, hash} from 'bcryptjs';
// import _ from 'lodash';

// @model()
// export class NewUserRequest extends User {
//   @property({
//     type: 'string',
//     required: true,
//   })
//   password: string;
// }

// const CredentialsSchema: SchemaObject = {
//   type: 'object',
//   required: ['email', 'password'],
//   properties: {
//     email: {
//       type: 'string',
//       format: 'email',
//     },
//     password: {
//       type: 'string',
//       minLength: 8,
//     },
//   },
// };

// export const CredentialsRequestBody = {
//   description: 'The input of login function',
//   required: true,
//   content: {
//     'application/json': {schema: CredentialsSchema},
//   },
// };

// export class UserController {
//   constructor(
//     @inject(TokenServiceBindings.TOKEN_SERVICE)
//     public jwtService: TokenService,
//     @inject(UserServiceBindings.USER_SERVICE)
//     public userService: MyUserService,
//     @inject(SecurityBindings.USER, {optional: true})
//     public user: UserProfile,
//     @repository(UserRepository) protected userRepository: UserRepository,
//   ) {}

//   @post('/users/login', {
//     responses: {
//       '200': {
//         description: 'Token',
//         content: {
//           'application/json': {
//             schema: {
//               type: 'object',
//               properties: {
//                 token: {
//                   type: 'string',
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   })
//   async login(
//     @requestBody(CredentialsRequestBody) credentials: Credentials,
//   ): Promise<{token: string}> {
//     // ensure the user exists, and the password is correct
//     const user = await this.userService.verifyCredentials(credentials);
//     // convert a User object into a UserProfile object (reduced set of properties)
//     const userProfile = this.userService.convertToUserProfile(user);

//     // create a JSON Web Token based on the user profile
//     const token = await this.jwtService.generateToken(userProfile);
//     return {token};
//   }

//   @authenticate('jwt')
//   @get('/whoAmI', {
//     responses: {
//       '200': {
//         description: 'Return current user',
//         content: {
//           'application/json': {
//             schema: {
//               type: 'string',
//             },
//           },
//         },
//       },
//     },
//   })
//   async whoAmI(
//     @inject(SecurityBindings.USER)
//     currentUserProfile: UserProfile,
//   ): Promise<string> {
//     return currentUserProfile[securityId];
//   }

//   @post('/signup', {
//     responses: {
//       '200': {
//         description: 'User',
//         content: {
//           'application/json': {
//             schema: {
//               'x-ts-type': User,
//             },
//           },
//         },
//       },
//     },
//   })
//   async signUp(
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(NewUserRequest, {
//             title: 'NewUser',
//           }),
//         },
//       },
//     })
//     newUserRequest: NewUserRequest,
//   ): Promise<User> {
//     const password = await hash(newUserRequest.password, await genSalt());
//     const savedUser = await this.userRepository.create(
//       _.omit(newUserRequest, 'password'),
//     );

//     await this.userRepository.userCredentials(savedUser.id).create({password});

//     return savedUser;
//   }
// }


import { Strategy as BearerStrategy } from 'passport-http-bearer';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
const writeErrorToResponse = require('strong-error-handler')
  .writeErrorToResponse;
import {User} from '../models';
import {UserRepository} from '../repositories';
import {genSalt, hash , compare } from 'bcryptjs';
import * as _jsonwebtoken from "jsonwebtoken"
const _ = require('lodash');
const jsonwebtoken = <any>_jsonwebtoken

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }


  
@post('/signup')
@response(200, {
  description: 'User model instance',
  content: {'application/json': {schema: getModelSchemaRef(User)}},
})
async signup(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {
          title: 'NewUser',
          exclude: ['id'],
        }),
      },
    },
  })
  user: Omit<User, 'id'>,
): Promise<User> {
  const verifExist = await this.userRepository.find({where: {email: user.email}})  
  if(verifExist.length > 0){
    throw new HttpErrors.BadRequest("user already exists")
  }
  const password = await hash(user.password, await genSalt());
  user.password = password
  return this.userRepository.create(user);
}

@post('/login')
@response(200, {
  description: 'User model instance',
  content: {'application/json': {schema: getModelSchemaRef(User)}},
})
async login(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {
          title: 'NewUser',
          exclude: ['id'],
        }),
      },
    },
  })
  user: Omit<User, 'id'>,
): Promise<Object> {
  if(user.email){
    const bodyuser = user
    const current = await this.userRepository.find({where: {email: user.email}})
      console.log("current ==>" , current[0]);
     const validCrendential = await compare(bodyuser.password, current[0].password)
        if(validCrendential){
          const token = jsonwebtoken.sign({_id: current[0].id}, "hzouhel" )
          const resUser = _.pick(current[0] ,  ['name', 'lastname' , "email" ])
          const res ={user : resUser ,"token" : token } 
         return res
        }
        throw new HttpErrors.BadRequest("Some Thing went wrong")
    
  }
  throw new HttpErrors.NotFound("user not found")
   
}
  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    const passwordIsMatched = await compare(providedPass, storedPass);
    return passwordIsMatched;
  }

  // async verifToken(
  //   token: string
    
  // ): Promise<boolean> {
  //   const passwordIsMatched = await compare(providedPass, storedPass);
  //   return passwordIsMatched;
  // }


}

