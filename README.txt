Adds support for Lidl ZigBee devices.

Requires Homey version 5.

Only supports the Melinera Smart LED String Lights sold by Lidl. Currently, no support is planned for other (Lidl) devices.

Other Lidl devices may be supported (in the future) by the Tuya Zigbee App.

Yes, I know, that App was/is planning support for the X-Mas lights as well, but it had a long list of requested features, and I wanted to play with my X-Mas lights now, in the holiday season, so created my own App for this specifically.


Pairing

Go into Homey and add the device. During pairing hold the F button for 5 seconds and let go. Light should start pulsing slowly and pairing should complete, the lights should then stop pulsing.


Controlling the lights

The X-Mas Lights support 3 modes: white, color and effect. You can switch between these modes in the App. You will mainly use this to switch back to white mode.

* The best way to switch to color mode is to simply select a color which then automatically switches to color mode.
* Manually selecting color mode may not switch back to last selected color.
* Switching to effect mode always starts a default effect, not the latest selected effect. To start a specific effect, use a flow (see below).

Brightness control is only available in white and color mode, brightness of effects cannot be controlled (this is a limitation of the hardware, not the App).

Changing brightness while an effect is active, switches back to white mode.

To start a specific effect, create a flow with Start effect action for your device. Select an effect type, set the speed and configure one or more colors.

Note: not all effects use all colors, some effect may only use one, two or three colors. At maximum 9 colors appear to be used by the device, so only 9 options are shown.


Attributions

supermarket icon by Bernar Novalyi from the Noun Project
Christmas tree by Stanislav Levin from the Noun Project