import ProcessDuplicates from "./ProcessDuplicates/processDuplicates"

export default class StepConcatenationController {
private input: any

    constructor(input){
        this.input = input
    }
public async initiateStepConcatenation(){

let processDuplicatesObject= new ProcessDuplicates;
await processDuplicatesObject.driver();
console.log(processDuplicatesObject.duplicatesArray)

    }
}