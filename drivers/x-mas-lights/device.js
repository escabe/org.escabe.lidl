'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER, Cluster } = require('zigbee-clusters');

debug(true);

class MyZigBeeDevice extends ZigBeeDevice {
    transactionID = 0;

    make4String(v) {
        let s = Math.round(v).toString(16);
        if(s.length===4) return s;
        else if(s.length===3) return '0'+s;
        else if(s.length===2) return '00'+s;
        else if(s.length===1) return '000' + s;
        else return '0000';
    }

    async onNodeInit({ zclNode }) {

        this.registerCapability('onoff', CLUSTER.ON_OFF);

        this.registerCapabilityListener('lidl_xmas_mode', async (value) => {
            this.log("Setting to " + value);
            const valMap = {white: 0, color: 1, scene: 2};
            this.transactionID++;
            this.transactionID %= 256;
            zclNode.endpoints[1].clusters.tuya.setEnum({
                status: 0,
                transid: this.transactionID,
                dp: 2,
                datatype: 4,
                length: 1,
                data: valMap[value]
            });
        });

        this.registerCapabilityListener('dim', async (value) => {
            this.log("Setting to " + value);
            const valMap = {white: 0, color: 1, scene: 2};
            this.transactionID++;
            this.transactionID %= 256;
            zclNode.endpoints[1].clusters.tuya.setUInt32({
                status: 0,
                transid: this.transactionID,
                dp: 3,
                datatype: 2,
                length: 4,
                data: value * 1000
            });
        });
        this.registerMultipleCapabilityListener(['light_hue','light_saturation'],(values,options) => {
            this.log(values);
            this.transactionID++;
            this.transactionID %= 256;
            zclNode.endpoints[1].clusters.tuya.setString({
                status: 0,
                transid: this.transactionID,
                dp: 5,
                datatype: 3,
                length: 0,
                data: this.make4String(values.light_hue * 360) + this.make4String(values.light_saturation * 1000) + this.make4String(500)
            });
        },500);


  }

}

module.exports = MyZigBeeDevice;
