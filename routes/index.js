import fastifyPlugin from "fastify-plugin";

async function indexRoutes(server, options) {
  server.get("/", async (request, reply) => {
    return {
      hello: "hello world",
      debugLevel: server.config.DEBUG_LEVEL,
    };
  });
}

export default fastifyPlugin(indexRoutes);
