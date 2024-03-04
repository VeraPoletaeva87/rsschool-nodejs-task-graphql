import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema} from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { Context } from './types/types.js';
import depthLimit from 'graphql-depth-limit';

const DEPTH_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query: source, variables: variableValues } = req.body;
      const { prisma } = fastify;
      const contextValue: Context = {
        prisma
      };
      const errors = validate(schema, parse(source), [depthLimit(DEPTH_LIMIT)]);

      if (errors.length > 0) {
        return { errors };
      }

      return graphql({
        source,
        variableValues,
        contextValue,
        schema: schema,
      });
    },
  });
};

export default plugin;
