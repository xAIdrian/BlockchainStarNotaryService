class ValidationResponse {
    constructor(bodyAddress) {
        this.address = bodyAddress;
        this.timestamp = new Date().getTime();
        this.returnMessage = this.address + ":" + this.timestamp + ":starRegistry";
        //time to take action. user has five minutes
        this.validationWindow = this.timestamp + (5 * 60000);
    }
}

module.exports = ValidationResponse;