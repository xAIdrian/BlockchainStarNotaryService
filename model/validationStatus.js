class ValidationStatus {
    constructor(bodyAddress) {
        this.address = bodyAddress;
        this.requestTimeStamp = new Date().getTime();
        this.message = this.address + ":" + this.requestTimeStamp + ":starRegistry";
        //time to take action. user has five minutes
        this.validationWindow = (this.requestTimeStamp + (5 * 60000)) - this.requestTimeStamp;
    }
}

module.exports = ValidationStatus;