import StepConcatenatorInterface from './step-concatenation-interface'

(async () => {
    const argv = require('yargs').argv;
    let stepConcatenatorInterface: StepConcatenatorInterface = new StepConcatenatorInterface(argv);
    stepConcatenatorInterface.initiateStepConcatenation();
})();


