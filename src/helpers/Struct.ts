export function DegreeData(type:number = 0, major:string = 'Unknown', gpa:number = 0.0, start_date:string = '0000-00-00', end_date:string = '0000-00-00') {
    this.type = type;
    this.major = major;
    this.gpa = gpa;
    this.start_date = start_date;
    this.end_date = end_date;
}