import fastifyEnv from "@fastify/env";

export default async function configPlugin(server, options, done) {
  const schema = {
    type: "object",
    required: ["HTTP_PORT"],
    properties: {
      HTTP_PORT: {
        type: "number",
        default: 3001,
      },
      DEBUG_LEVEL: {
        type: "number",
        default: 1000,
      },
    },
  };

  const configOptions = {
    // decorate the Fastify server instance with `config` key
    // such as `fastify.config('PORT')
    confKey: "config",
    // schema to validate
    schema: schema,
    // source for the configuration data
    data: process.env,
    // will read .env in root folder
    dotenv: true,
    // will remove the additional properties
    // from the data object which creates an
    // explicit schema
    removeAdditional: true,
  };

  return fastifyEnv(server, configOptions, done);
}
