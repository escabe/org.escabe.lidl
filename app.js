'use strict';

const Homey = require('homey');
//require('inspector').open(9229, '0.0.0.0')

class LidlZigbeeApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('Lidl Zigbee App has been initialized');

    this.homey.flow.getActionCard('start_effect').registerRunListener(async (args, state) => {
      this.log("ACTION TRIGGERED");
      await args.my_device.StartEffect(args);
      return true
    })

  }
}

module.exports = LidlZigbeeApp;