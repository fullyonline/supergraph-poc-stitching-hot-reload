import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from '../utils/read_file_sync.js';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typeDefs = readFileSync(__dirname, './schema.graphql');

export function makeEndpointsSchema(loader) {
    return makeExecutableSchema({
        typeDefs,
        resolvers: {
            Query: {
                endpoints: () => loader.loadedEndpoints,
            },
            Mutation: {
                async addEndpoint(_root, { url }) {
                    let success = false;
                    if (!loader.endpoints.includes(url)) {
                        loader.endpoints.push(url);
                        await loader.reload();
                        success = true;
                    }
                    return {
                        endpoint: loader.loadedEndpoints.find(s => s.url === url),
                        success,
                    };
                },
                async removeEndpoint(_root, { url }) {
                    let success = false;
                    const index = loader.endpoints.indexOf(url);
                    if (index > -1) {
                        loader.endpoints.splice(index, 1);
                        await loader.reload();
                        success = true;
                    }
                    return { success };
                },
                async reloadAllEndpoints() {
                    await loader.reload();
                    return { success: true };
                },
            },
        }
    });
};