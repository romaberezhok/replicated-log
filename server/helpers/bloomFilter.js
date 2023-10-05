const crypto = require('crypto');
class BloomFilter {
    constructor(size, numHashFunctions) {
        this.size = size;
        this.numHashFunctions = numHashFunctions;
        this.bitArray = new Array(size).fill(false);
    }

    add(message) {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hash(message, i);
            this.bitArray[index] = true;
        }
    }

    contains(message) {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hash(message, i);
            if (!this.bitArray[index]) {
                return false;
            }
        }
        return true;
    }

    hash(message, seed) {
        const hash = crypto.createHash('sha256');
        hash.update(message + seed.toString());
        const digest = hash.digest('hex');
        return parseInt(digest, 16) % this.size;
    }
}

module.exports = {
    BloomFilter
}