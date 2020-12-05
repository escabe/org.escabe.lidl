'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER, Cluster } = require('zigbee-clusters');

debug(true);

class MyZigBeeDevice extends ZigBeeDevice {
    transactionID = 0;
    zclNode;

    make4String(v) {
        let s = Math.round(v).toString(16);
        if(s.length===4) return s;
        else if(s.length===3) return '0'+s;
        else if(s.length===2) return '00'+s;
        else if(s.length===1) return '000' + s;
        else return '0000';
    }

    setColor({dim,light_hue,light_saturation}) {
        if (dim===undefined) dim = this.getCapabilityValue('dim');
        if (light_hue==undefined) light_hue = this.getCapabilityValue('light_hue');
        if (light_saturation==undefined) light_saturation = this.getCapabilityValue('light_saturation');
        this.transactionID++;
        this.transactionID %= 256;
        this.zclNode.endpoints[1].clusters.tuya.setString({
            status: 0,
            transid: this.transactionID,
            dp: 5,
            datatype: 3,
            length: 0,
            data: this.make4String(light_hue * 360) + this.make4String(light_saturation * 1000) + this.make4String(dim * 1000)
        });
    }

    setWhiteDim({dim}) {
        if (dim===undefined) dim = this.getCapabilityValue('dim');
        this.transactionID++;
        this.transactionID %= 256;
        this.zclNode.endpoints[1].clusters.tuya.setUInt32({
            status: 0,
            transid: this.transactionID,
            dp: 3,
            datatype: 2,
            length: 4,
            data: dim * 1000
        });
    }

    async onNodeInit({ zclNode }) {
        this.zclNode = zclNode;
        this.registerCapabilityListener('onoff', async (value) => {
            this.transactionID++;
            this.transactionID %= 256;
            zclNode.endpoints[1].clusters.tuya.setBool({
                status: 0,
                transid: this.transactionID,
                dp: 1,
                datatype: 1,
                length: 1,
                data: value
            });
        });

        this.registerCapabilityListener('lidl_xmas_mode', async (mode) => {
            const valMap = {white: 0, color: 1, scene: 2};
            this.transactionID++;
            this.transactionID %= 256;
            await zclNode.endpoints[1].clusters.tuya.setEnum({
                status: 0,
                transid: this.transactionID,
                dp: 2,
                datatype: 4,
                length: 1,
                data: valMap[mode]
            });
            switch (mode) {
                case 'color':
                    this.setColor({});
                    break;
                case 'white':
                default:
                    this.setWhiteDim({});
            }
        });

        this.registerCapabilityListener('dim', async (dim) => {
            const mode = this.getCapabilityValue('lidl_xmas_mode');
            switch (mode) {
                case 'color':
                    this.setColor({dim});
                    break;
                case 'white':
                default:
                    this.setWhiteDim({dim});
            }
        });

        this.registerMultipleCapabilityListener(['light_hue','light_saturation'],(values,options) => {
            this.setCapabilityValue('lidl_xmas_mode','color');
            this.setColor(values);
        },500);


  }

}

module.exports = MyZigBeeDevice;
