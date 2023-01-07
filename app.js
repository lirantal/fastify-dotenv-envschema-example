import Fastify from "fastify";

import indexRoutes from "./routes/index.js";
import envPlugin from "./plugins/env.js";

export default async function appFramework() {
  const fastify = Fastify({ logger: true });
  fastify.register(envPlugin);
  fastify.register(indexRoutes);

  // We have to call fastify.ready() so that
  // fastify begins loading and applying all
  // of the plugins, and then the `fastify`
  // object applies all the decoration required
  // for us to access `fastify.config`
  await fastify.ready();

  return fastify;
}
