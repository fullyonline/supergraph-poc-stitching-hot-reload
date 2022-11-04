import { CostUnit } from './costUnit'
import { Status } from '../gqlSchema'

export class ServiceAppointment {
  sender: string
  reportnr: string
  caseNumber: number
  costUnit: CostUnit
  status: Status
  patientNumber: string

  constructor(
    sender: string,
    reportnr: string,
    caseNumber: number,
    costUnit: CostUnit,
    status: Status,
    patientNumber: string,
  ) {
    this.sender = sender
    this.reportnr = reportnr
    this.caseNumber = caseNumber
    this.costUnit = costUnit
    this.status = status
    this.patientNumber = patientNumber
  }
}
