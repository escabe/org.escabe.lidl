'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER,debug } = require('zigbee-clusters');

debug(true);

class MyZigBeeDevice extends ZigBeeDevice {

	async onNodeInit({ zclNode }) {
		this.log('MyZigBeeDevice has been inited');
		await this.configureAttributeReporting([
			{
				endpointId: 1,
				cluster: CLUSTER.IAS_ZONE,
				attributeName: 'zoneStatus',
				minInterval: 65535,
				maxInterval: 0,
				minChange: 1,
			},{
				endpointId: 1,
				cluster: CLUSTER.POWER_CONFIGURATION,
				attributeName: 'batteryPercentageRemaining',
				minInterval: 65535,
				maxInterval: 0,
				minChange: 0,
			}
		]);
		zclNode.endpoints[1].clusters.iasZone.on('attr.zoneStatus', (status) => {
			this.setCapabilityValue('alarm_contact', status.alarm1);
			this.setCapabilityValue('alarm_tamper', status.tamper);
		});
		zclNode.endpoints[1].clusters.powerConfiguration.on('attr.batteryPercentageRemaining', (status) => {
			this.setCapabilityValue('measure_battery', status/2);
		});
	}

}

module.exports = MyZigBeeDevice;
