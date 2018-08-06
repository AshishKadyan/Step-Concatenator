import StepConcatenatorController from './step-concatenation.controller';

export default class StepconcatenationInterface {

    private input: Object;
    private args: Object;
    constructor(args: Object) {
        this.args = args;
    }
    public async initiateStepConcatenation() {
        this.createInputForconcatenationController();
        let stepConcatenationControllerObject: StepConcatenatorController = new StepConcatenatorController(this.input);
        stepConcatenationControllerObject.initiateStepConcatenation();
        
    }

    private createInputForconcatenationController() {
        this.input = {
            'taskId': this.args['task'],
            'stepNumber': this.args['step'],
            'outputLocation': this.args['output'],
            'mode': this.args['mode'],
            'local': this.args['local']
        };
    }

}