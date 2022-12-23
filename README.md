# About

This repository aims to provide Node.js developers who wish to build upon the [Fastify application framework](https://www.fastify.io) and use a configuration element with explicit schema with a flexible source of data for configuration.

This project uses the following components to satisfy configuration:
1. [dotenv](https://snyk.io/advisor/npm-package/dotenv) - a popular npm package that loads configuration from a file into the `process.env` variable.
2. [env-schema](https://github.com/fastify/env-schema) - an npm package that validates the configuration source passed to it, or `process.env`, against a schema and provides back a validated object.
3. [@fastify/env](https://github.com/fastify/fastify-env) - a Fastify plugin that loads configuration source into the Fastify application instance.

## Using the demo

As a pre-requisite to using this demo Fastify application you need to copy the `.env-sample` file to `.env` so that the  `dotenv` integration will load it up:

```sh
cp .env-sample .env
```

Then run the Node.js server:

```sh
npm run start
```

Now, you're ready to use this demo application in the following ways:
1. Inspect the `server.js` code and notice that the server instantiates based on an HTTP port information that is loaded from configuration.
2. Make a request to the top level `/` URL and notice that the `debugLevel` property is read from the `.env` configuration. You can fire a request from the CLI to test it: `curl "http://localhost:3000"`

## Environment variable configuration

It's common to access environment variables to configure different aspects of a running
Node.js application, such as:

```javascript
https.listen(process.env.HTTP_PORT, () => {
    console.log('server started on port: ', process.env.HTTP_PORT);
});
```

## Using dotenv with Fastify

Dotenv here is used as the underlying source to feed the Fastify plugin `@fastify/env`
and lives in [./plugins/env.js](./plugins/env.js), where it loads all
configuration information.

In that file, we set the configuration source to be `dotenv` and its related schema
in the way we expect it to be used in the application.

```javascript
import fastifyEnv from "@fastify/env";

export default async function configPlugin(server, options, done) {
  const schema = {
    type: "object",
    required: ["HTTP_PORT"],
    properties: {
      PORT: {
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
```

We then register this plugin in the `server.js` file, such as:

```javascript
import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";

import indexRoutes from "./routes/index.js";
import envPlugin from "./plugins/env.js";

const fastify = Fastify({ logger: true });
fastify.register(fastifyPlugin(envPlugin));
fastify.register(fastifyPlugin(indexRoutes));

async function initAppServer() {
  // We have to call fastify.ready() so that
  // fastify begins loading and applying all
  // of the plugins, and then the `fastify`
  // object applies all the decoration required
  // for us to access `fastify.config`
  await fastify.ready();
```

You can then access any process environment variable from anywhere that has a
`fastify` application instance available.

```javascript
const myPort = fastify.config.HTTP_PORT
```

# Author

Liran Tal <liran.tal@gmail.com>
