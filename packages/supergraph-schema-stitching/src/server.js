import {createServer} from '@graphql-yoga/node';
import {makeRemoteExecutor} from './utils/make_remote_executor.js';
import {makeEndpointsSchema} from './endpoints/schema.js';
import {SchemaLoader} from './utils/schema_loader.js';
import {buildSchema} from 'graphql';
import {stitchSchemas} from '@graphql-tools/stitch';
import {stitchingDirectives} from '@graphql-tools/stitching-directives';

const { stitchingDirectivesTransformer } = stitchingDirectives();

const loader = new SchemaLoader({
  endpoints: [
    'http://127.0.0.1:4000/graphql',
    'http://127.0.0.1:4200/graphql',
    'http://127.0.0.1:4100/graphql',
  ],
  buildSchema: (loadedEndpoints) => {
    const subschemas = loadedEndpoints.map(({ sdl, url }) => ({
      schema: buildSchema(sdl),
      executor: makeRemoteExecutor(url, { timeout: 5000 }),
      batch: true,
    }));

    subschemas.push(makeEndpointsSchema(loader));

    return stitchSchemas({
      subschemaConfigTransforms: [stitchingDirectivesTransformer],
      subschemas,
    });
  }
});

let intervalId = null;
let server = null;


function autoRefresh(interval=3000) {
  stopAutoRefresh();
  intervalId = setTimeout(async () => {

    loader.reload().then(() => {
      try{
        server.stop();
      }catch{}
      server = createServer({
        schema: loader.schema,
        port: 4500,
        maskedErrors: false
      });
      server.start();
      autoRefresh(interval);
    });
  }, interval);
}

function stopAutoRefresh() {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

autoRefresh();