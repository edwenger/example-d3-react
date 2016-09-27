var cuid = require('cuid');

class TransmissionNode {

    constructor(x=0, y=0, weight=1, receptivity=1, infectiousness=0, contact_weights={}) {
        this.id = cuid();
        this.x = x;
        this.y = y;
        this.weight = weight;
        this.receptivity = receptivity;
        this.infectiousness = infectiousness;
        this.contact_weights = contact_weights;
    }

    transmit() {

    }

    update() {

    }
}

module.exports = TransmissionNode;