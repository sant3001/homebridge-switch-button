import {
  API,
  Logger,
  AccessoryConfig,
  Service,
  AccessoryPlugin,
  CharacteristicValue,
  Characteristic,
} from 'homebridge';
import { Switch, Lightbulb } from 'hap-nodejs/dist/lib/definitions';

interface Config extends AccessoryConfig {
  delay: number;
  switchName: string;
  lightName: string;
}

export class HomebridgeSwitchButtonAccessory implements AccessoryPlugin {
  public readonly Characteristic: typeof Characteristic;
  public readonly Service: typeof Service;

  private readonly config: Config;
  private readonly informationService: Service;
  private readonly switchService: Switch;
  private readonly lightService: Lightbulb;

  private readonly uuid: string;
  private states = {
    SwitchOn: false,
    LightOn: false,
  };

  private timer: NodeJS.Timeout | undefined;

  constructor(
      public readonly log: Logger,
      config: AccessoryConfig,
      public readonly api: API,
  ) {
    this.config = config as Config;

    this.Characteristic = this.api.hap.Characteristic;
    this.Service = this.api.hap.Service;

    this.uuid = api.hap.uuid.generate(this.config.name);

    // your accessory must have an AccessoryInformation service
    this.informationService = new this.Service.AccessoryInformation();
    this.informationService.setCharacteristic(this.Characteristic.Name, this.config.name);
    this.informationService.setCharacteristic(this.Characteristic.Manufacturer, 'Switch Button');
    this.informationService.setCharacteristic(this.Characteristic.Model, 'Custom Model');
    this.informationService.setCharacteristic(this.Characteristic.SerialNumber, this.uuid);

    // create a new "Switch" service
    this.switchService = new this.Service.Switch(this.config.switchName || 'Switch');

    // link methods used when getting or setting the state of the service
    const switchCharacteristic = this.switchService.getCharacteristic(this.Characteristic.On);
    switchCharacteristic.onGet(this.getSwitchOnHandler.bind(this)); // bind to getOnHandler method below
    switchCharacteristic.onSet(this.setSwitchOnHandler.bind(this)); // bind to setOnHandler method below

    this.lightService = new this.Service.Lightbulb(this.config.lightName || 'Light');

    const lightCharacteristics = this.lightService.getCharacteristic(this.Characteristic.On);
    lightCharacteristics.onGet(this.getLightOnHandler.bind(this)); // bind to getOnHandler method below
    lightCharacteristics.onSet(this.setLightOnHandler.bind(this)); // bind to setOnHandler method below

    this.log.debug('Finished initializing accessory:', this.config.name);
  }

  getServices() {
    return [
      this.informationService,
      this.switchService,
      this.lightService,
    ];
  }

  async getSwitchOnHandler(): Promise<CharacteristicValue> {
    const isOn = this.states.SwitchOn;
    this.log.debug('Get Switch Characteristic On: ', isOn);
    return isOn;
  }

  async setSwitchOnHandler(value: CharacteristicValue) {
    const on = !!value as boolean;
    this.log.debug('Setting switch state to ', on ? 'On' : 'Off');
    this.states.SwitchOn = on;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (on) {
      this.log.debug('Start switch timer');
      // Flip the light bulb state
      this.states.LightOn = !this.states.LightOn;
      this.lightService.getCharacteristic(this.Characteristic.On).updateValue(this.states.LightOn);
      this.log.debug('Switch timer completed, light is now ', this.states.LightOn? 'On' : 'Off');

      this.timer = setTimeout(() => {
        // Turn off the switch
        this.states.SwitchOn = false;
        this.switchService.getCharacteristic(this.Characteristic.On).updateValue(false);
      }, this.config.delay || 500);
    }
  }

  async getLightOnHandler(): Promise<CharacteristicValue> {
    const isOn = this.states.LightOn;
    this.log.debug('Get Light Characteristic On: ', isOn);
    return isOn;
  }

  async setLightOnHandler(value: CharacteristicValue) {
    this.log.debug('Setting light state to:', value);
    this.states.LightOn = value as boolean;
  }
}