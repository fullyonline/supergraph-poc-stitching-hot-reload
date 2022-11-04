import { makeRemoteExecutor } from './make_remote_executor.js';

export class SchemaLoader {
    constructor({ buildSchema, endpoints }) {
        this.buildSchema = buildSchema;
        this.endpoints = endpoints;
        this.loadedEndpoints = [];
        this.schema = null;
    }

    async reload() {
        const loadedEndpoints = await Promise.all(this.endpoints.map(async (url) => {
            try {
                const fetcher = makeRemoteExecutor(url, { timeout: 200 });

                // const { data } = await fetcher({ document: '{ _sdl }' });
                // Um das "DirectivePlugin" von Pothos zu verwenden, muss das Query stimmen!
                const { data } = await fetcher({ document: '{ _service { sdl } }' });

                return {
                    url,
                    sdl: data._service.sdl,
                };
            } catch (err) {
                // drop the schema, or return the last cached version, etc...
                return null;
            }
        }));

        this.loadedEndpoints = loadedEndpoints.filter(Boolean);
        this.schema = this.buildSchema(this.loadedEndpoints);
        console.log(`gateway reload ${Date.now()}, endpoints: ${this.loadedEndpoints.length}`);
        return this.schema;
    }
};