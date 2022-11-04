import { introspectSchema } from '@graphql-tools/wrap'
import { makeRemoteExecutor } from "./utils/make_remote_executor.js";
import { stitchSchemas } from '@graphql-tools/stitch';
import { delegateToSchema } from '@graphql-tools/delegate'

const patientGraphqlUrl = 'http://127.0.0.1:4000/';
const casesGraphqlUrl = 'http://127.0.0.1:4200/graphql';
const servicesGraphqlUrl = 'http://127.0.0.1:4100/graphql';

export const patientsSubschema = {
        schema: await introspectSchema(makeRemoteExecutor(patientGraphqlUrl)),
        executor: makeRemoteExecutor(patientGraphqlUrl)
}

export const casesSubschema = {
    schema: await introspectSchema(makeRemoteExecutor(casesGraphqlUrl)),
    executor: makeRemoteExecutor(casesGraphqlUrl)
}

export const servicesSubschema = {
    schema: await introspectSchema(makeRemoteExecutor(servicesGraphqlUrl)),
    executor: makeRemoteExecutor(servicesGraphqlUrl)
}

export function getSchemas(){
    return stitchSchemas({
    subschemas: [patientsSubschema, casesSubschema, servicesSubschema],
    mergeTypes: true, // << default in v7
    typeDefs: `
        type Query { heartbeat: String! }
        extend type ServiceAppointment {
            patient: Patient
        }
    `,
    resolvers: {
        Query: {
            heartbeat: () => 'OK',
        },
        ServiceAppointment: {
            patient: {
                selectionSet: `{ patientNumber }`,
                resolve(serviceAppointment, args, context, info) {
                    console.log('delegateToSchema', serviceAppointment, args, context, info);
                    return delegateToSchema({
                        schema: patientsSubschema,
                        operation: 'query',
                        fieldName: 'patient', // +/- was _entities entspricht bei Federation
                        args: { patientNumber: serviceAppointment.patientNumber },
                        context,
                        info
                      })
                }
            }
        }
    }
})};

