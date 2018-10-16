class ValidationStatus {
    constructor(bodyAddress) {
        this.address = bodyAddress;
        this.requestTimeStamp = new Date().getTime();
        this.message = this.address + ":" + this.requestTimeStamp + ":starRegistry";
        //time to take action. user has five minutes
        this.validationWindow = 300000;
    }
}

module.exports = ValidationStatus;