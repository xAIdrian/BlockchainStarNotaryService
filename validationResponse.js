class ValidationResponse {
    constructor(bodyAddress) {
        this.address = bodyAddress;
        this.timestamp = new Date().getTime();
        //time to take action. user has five minutes
        this.validationWindow = timestamp + (5 * 60000);
        this.returnMessage = bodyAddress + ":" + timestamp + ":starRegistry";
    }
}