import SchemaBuilder from '@pothos/core';
import { CostUnit } from './models/costUnit';
import { ServiceAppointment } from './models/serviceAppointment';
import DirectivePlugin from '@pothos/plugin-directives';
import FederationPlugin from '@pothos/plugin-federation';

export enum Status {
  AKTIV = "AKTIV",
  INAKTIV = "INAKTIV",
}

const builder = new SchemaBuilder({
  // If you are using other plugins, the federation plugin should be listed after plugins like auth that wrap resolvers
  plugins: [DirectivePlugin, FederationPlugin],
});

builder.enumType(Status, {
  name: 'Status',
})

const CostUnitType = builder.objectType(CostUnit, {
  name: 'CostUnit',
  description: 'Kostenstelle',
  fields: (t) => ({
    code: t.exposeString('code'),
    name: t.exposeString('name')
  })
})

// builder.asEntity(CostUnitType, {
//   key: builder.selection<{ code: string }>('code'),
//     resolveReference: (costUnit, costUnits: any) => costUnits.find(({ code }: any) => costUnit.code === code),
// })

const ServiceAppointmentType = builder.objectType(ServiceAppointment, {
  name: 'ServiceAppointment',
  description: 'Leistungssitzung',
  fields: (t) => ({
    sender: t.exposeString('sender', {}),
    reportnr: t.exposeString('reportnr', {}),
    caseNumber: t.exposeInt('caseNumber', {}),
    patientNumber: t.exposeString('patientNumber'),
    status: t.expose('status', {type: Status}),
    costUnit: t.field({
      type: CostUnitType,
      resolve: (parent) => {
        return parent.costUnit;
      },
    }),
    
  }),
});

// builder.asEntity(ServiceAppointmentType, {
//   key: builder.selection<{ reportnr: string }>("reportnr"),
//     resolveReference: (serviceAppointment, serviceAppointments: any) => serviceAppointments.find(({ reportnr }: any) => serviceAppointment.reportnr === reportnr)
// })

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),

    serviceAppointments: t.field({
      type: [ServiceAppointment],
      description: 'All Service Appointments',
      resolve: () => {
        console.log("calling - service appointments");
        const costUnit = new CostUnit('KS1', 'Kostenstelle 1');
        return [
        new ServiceAppointment('TST', '1234', 1234, costUnit, Status.INAKTIV, 'TD1234'),
        new ServiceAppointment('TST', '12345', 1234, costUnit, Status.AKTIV, 'TD1234'),
        new ServiceAppointment('TST', '123456', 2345, costUnit, Status.AKTIV, 'TD0001'),
      ]}
      ,
    }),
    
  }),
});

export const schema = builder.toSubGraphSchema({});