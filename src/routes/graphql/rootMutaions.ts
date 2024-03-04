import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context, PostType, ProfileType, Profile_Type, UserType, User_Type } from './types/types.js';
import { User } from '@prisma/client';

import { ChangePostInput, ChangeProfileInput, ChangeUserInput, CreateProfileInput, CreatePostInput, Post_Type, CreateUserInput } from './types/mutationsTypes.js';
import { UUIDType } from './types/uuid.js';

interface PostArgs {
  id: string;
  dto: Omit<Post_Type, 'id'>;
}

interface ProfileArgs {
  id: string;
  dto: Omit<Profile_Type, 'id'> & Partial<Omit<Profile_Type, 'id' | 'userId'>>;
}
interface UserArgs {
  id: string;
  dto: Omit<User_Type, 'id'>;
}

interface SubscriptionArgs {
  userId: string;
  authorId: string;
}

export const rootMutation = new GraphQLObjectType({
  name: 'rootMutation',
  fields: {
    createPost: {
      type: PostType,
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (_obj, args: PostArgs, ctx: Context) =>
      {
        const post = await ctx.prisma.post.create({ data: args.dto });
        return post;
      } 
    },
  
    changePost: {
      type: PostType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangePostInput },
      },
      resolve: async (_obj, args: PostArgs, ctx: Context) =>
      {
       return await ctx.prisma.post.update({ where: { id: args.id }, data: args.dto })
      },
    },
  
    deletePost: {
      type: new GraphQLNonNull(UUIDType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_obj, args: PostArgs, ctx: Context) => {
        await ctx.prisma.post.delete({ where: { id: args.id } });
        return args.id;
      },
    },

    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_obj, args: ProfileArgs, ctx: Context) => {
        return await ctx.prisma.profile.create(
          {
             data: args.dto 
          });
      }
    },
  
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeProfileInput },
      },
      resolve: async (_obj, args: ProfileArgs, ctx: Context) => {
        return await ctx.prisma.profile.update(
          { 
            where: 
            { 
              id: args.id 
            },
             data: args.dto 
          });
      }
    },
  
    deleteProfile: {
      type: new GraphQLNonNull(UUIDType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_obj, args: ProfileArgs, ctx: Context) => {
       await ctx.prisma.profile.delete(
          { 
            where:
             { 
              id: args.id 
            } 
          });
          return args.id;
      }
    },
    createUser: {
      type: UserType,
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (_obj, args: UserArgs, ctx: Context) =>
      {
        const user = await ctx.prisma.user.create({ data: args.dto });
        return user;
      } 
    },
  
    changeUser: {
      type: UserType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeUserInput },
      },
      resolve: async (_obj, args: UserArgs, ctx: Context) => {
        return await ctx.prisma.user.update(
          { 
            where: 
            { 
              id: args.id 
            },
             data: args.dto 
          });
      }
    },
  
    deleteUser: {
      type: new GraphQLNonNull(UUIDType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_obj, args: UserArgs, ctx: Context) => {
        await ctx.prisma.user.delete(
          { 
            where:
             { 
              id: args.id 
            } 
          });
          return args.id;
      }
    },
    subscribeTo: {
      type: new GraphQLNonNull(UserType),
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
  
      resolve: async (_obj, args: SubscriptionArgs, ctx: Context) => {
        await ctx.prisma.subscribersOnAuthors.create({
          data: { subscriberId: args.userId, authorId: args.authorId },
        });
        return await ctx.prisma.user.findFirst({ where: { id: args.userId } });
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
  
      resolve: async (_obj, args: SubscriptionArgs, ctx: Context) => {
        await ctx.prisma.subscribersOnAuthors.deleteMany({
          where: { subscriberId: args.userId, authorId: args.authorId },
        });
  
        return args.authorId;
      },
    },
  }
});
