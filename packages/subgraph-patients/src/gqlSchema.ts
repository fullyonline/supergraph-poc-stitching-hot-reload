import {enumType, list, makeSchema, objectType} from 'nexus'
import { join } from 'path'

const Status = enumType({
    name: 'Status',
    members: ["GELOESCHT", "AKTIV"],
});

const Patient = objectType({
    name: 'Patient',
    definition(t) {
        t.string('patientNumber');
        t.string('firstName');
        t.string('lastName');
        t.string('gender');
        t.field('status', { type: Status, description: 'Status' });
    }
})

const Query = objectType({
    name: 'Query',
    definition(t) {
        t.field('patients', {
            type: list(Patient),
            description: 'All Patients',
            resolve: () => {
                console.log("calling - patients");
                return [{
                    patientNumber: 'TD1234',
                    firstName: 'James',
                    lastName: 'Bond',
                    gender: 'm',
                    status: 'GELOESCHT'
                }, {
                    patientNumber: 'TD0001',
                    firstName: 'Jane',
                    lastName: 'Bond',
                    gender: 'f',
                    status: 'AKTIV'
                }];
            },
        });
    }})

export const schema = makeSchema({
  types: [Query, Patient],
  outputs: {
    typegen: join(__dirname, '/generated', 'nexus-typegen.ts'),
    schema: join(__dirname, '/generated', 'schema.graphql'),
  },
})