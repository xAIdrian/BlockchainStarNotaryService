class MessageSignature {
    constructor(verifyStatus) {
        this.registerStar = true;
        this.status = verifyStatus;
    }
}

module.exports = MessageSignature;