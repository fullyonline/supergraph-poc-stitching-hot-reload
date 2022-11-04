import SchemaBuilder from '@pothos/core';
import DirectivePlugin from '@pothos/plugin-directives';
import FederationPlugin from '@pothos/plugin-federation';
import { Case as ICase, CaseVariant as ICaseVariant } from './models/case';

const builder = new SchemaBuilder({
    // If you are using other plugins, the federation plugin should be listed after plugins like auth that wrap resolvers
    plugins: [DirectivePlugin, FederationPlugin],
});

const CaseVariantType = builder.enumType(ICaseVariant, {
    name: 'CaseVariant'
});

// const CaseType 
const CaseType = builder.objectRef<ICase>('Case').implement({
    fields: (t) => ({
        caseNumber: t.exposeInt('caseNumber'),
        newNumber: t.exposeInt('newNumber'),
        caseType: t.expose('caseType', {
            type: CaseVariantType
        })
    }),
});

const cases: ICase[] = [
    { caseNumber: 1234, caseType: ICaseVariant.Ambulant, newNumber: 666 },
    { caseNumber: 2345, caseType: ICaseVariant.Ambulant, newNumber: 666 },
    { caseNumber: 3456, caseType: ICaseVariant.Stationaer, newNumber: 666 },
]
//
// const cases: ICase[] = [
//     { caseNumber: 1234, caseType: ICaseVariant.Ambulant },
//     { caseNumber: 2345, caseType: ICaseVariant.Ambulant },
//     { caseNumber: 3456, caseType: ICaseVariant.Stationaer },
// ]


builder.queryType({
    fields: (t) => ({
        hello: t.string({
            args: {
                name: t.arg.string(),
            },
            resolve: (parent, { name }) => `hello, ${name || 'World'}`,
        }),
        cases: t.field({
            type: [CaseType],
            description: 'All Cases',
            resolve: () => {
                console.log("calling - cases");
                return cases;
            }
        })
    }),
});

export const pothosSchema = builder.toSubGraphSchema({});
