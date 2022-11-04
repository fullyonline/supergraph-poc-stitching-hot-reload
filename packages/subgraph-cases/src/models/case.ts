export enum CaseVariant {
    Stationaer = 'Stationär',
    Ambulant = 'Ambulant'
}

export interface Case {
    caseNumber: number,
    newNumber: number,
    caseType: CaseVariant
}