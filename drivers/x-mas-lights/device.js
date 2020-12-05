'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER, Cluster } = require('zigbee-clusters');


debug(true);

class MyZigBeeDevice extends ZigBeeDevice {

    async onNodeInit({ zclNode }) {

        this.registerCapability('onoff', CLUSTER.ON_OFF);

        this.registerCapabilityListener('my_mode', async (value) => {
            console.log("Setting to " + value);
            const valMap = {white:0,color:1,scene:2};
            zclNode.endpoints[1].clusters.tuya.setEnum({
                status: 0,
                transid:  0,
                dp: 2,
                datatype: 4,
                length_hi: 0,
                length_lo: 1,
                data: valMap[value]
              });
        });

        this.registerCapabilityListener('dim', async (value) => {
          console.log("Setting to " + value);
          const valMap = {white:0,color:1,scene:2};
          zclNode.endpoints[1].clusters.tuya.setUInt32({
              status: 0,
              transid:  0,
              dp: 3,
              datatype: 2,
              length_hi: 0,
              length_lo: 4,
              data: value * 1000
            });
      });

      }

}

module.exports = MyZigBeeDevice;
