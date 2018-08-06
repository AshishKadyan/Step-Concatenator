import ProcessDuplicates from "./ProcessDuplicates/processDuplicates"

export default class StepConcatenationController {
private input: any

    constructor(input){
        this.input = input
    }
public async initiateStepConcatenation(){

let processDuplicatesObject= new ProcessDuplicates;
processDuplicatesObject.driver();

    }
}