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
        let hash = 0;
        for (let i = 0; i < message.length; i++) {
            hash += message.charCodeAt(i);
        }
        return (hash + seed) % this.size;
    }
}

module.exports = {
    BloomFilter
}
