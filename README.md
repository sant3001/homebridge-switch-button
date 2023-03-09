
<p align="center">
<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">
</p>

[![npm package](https://badgen.net/npm/v/homebridge-switch-button)](https://www.npmjs.com/package/homebridge-switch-button)
[![Total downloads](https://badgen.net/npm/dt/homebridge-switch-button)](https://www.npmjs.com/package/homebridge-switch-button)
[![Build, Lint and Type check](https://github.com/sant3001/homebridge-switch-button/actions/workflows/build.yml/badge.svg)](https://github.com/sant3001/homebridge-switch-button/actions/workflows/build.yml)

# Homebridge Switch Button

With this plugin you can create simple automations in Homekit for a light connected with a physical button. It creates two fake switches that can be linked to your physical button and your physical light correspondingly. 

The button switch will start a timer when turned `ON`. When the delay time is reached the switch will automatically turn `OFF` and it will flip the state of the light switch from `ON` to `OFF`, and from `OFF` to `ON` accordingly.

By adding this plugin you can avoid converting your automation to Shorcuts and doing if conditions that are not always reliable.

## Configuration

```json
{
  "name": "My Switch Light",
  "delay": 500,
  "switchName": "Button Switch",
  "lightName": "Light Switch",
  "accessory": "HomebridgeSwitchButton"
}
```

## Homekit automations

1. Link the `Single Press` action of your physical button to turn the button switch to `ON`.
2. Create an automation to turn `ON` your physical light when the light switch is turned `ON`.
3. Create a second automation to turn `OFF` your physical light when the light switch is turned `OFF`.

Vualá! You're all set.
