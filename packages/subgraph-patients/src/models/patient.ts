export enum Status{
    GELOESCHT = "GELOESCHT",
    AKTIV = "AKTIV",
}

export interface Patient{
    patientNumber: string;
    firstName: string;
    lastName: string;
    gender: string;
    status: Status;
}

