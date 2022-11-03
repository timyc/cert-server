export function DegreeData(highest_degree:number = 0, major_name:string = 'Unknown', gpa:number = 0.0, begin_date:string = '0000-00-00', end_date:string = '0000-00-00') {
    this.highest_degree = highest_degree;
    this.major_name = major_name;
    this.gpa = gpa;
    this.begin_date = begin_date;
    this.end_date = end_date;
}