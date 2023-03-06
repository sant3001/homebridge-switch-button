import { API } from 'homebridge';

import { ACCESSORY_NAME, PLUGIN_NAME } from './settings';
import { HomebridgeSwitchButtonAccessory } from './accessory';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  api.registerAccessory(PLUGIN_NAME, ACCESSORY_NAME, HomebridgeSwitchButtonAccessory);
};
