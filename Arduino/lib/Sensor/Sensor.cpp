
//
//  Sensor.cpp
//  Sensor
//
//  Created by Cesar Torres on 7/2/14.
//  Copyright (c) 2014 Cesar Torres. All rights reserved.
//

#include "Sensor.h"

Sensor::Sensor(unsigned int _pin, unsigned int _min, unsigned int _max){
  pin = _pin;
  min_cap = _min;
  max_cap = _max;
  init();
} 

void Sensor::init(){
  pinMode(pin, INPUT);  
}

void Sensor::print(){
  Serial.print("Sensor ");
  Serial.print(": { value: ");
  Serial.print(value);
  Serial.println("}");
}

int Sensor::update(){
  value = analogRead(pin); 
  value = constrain(value, min_cap, max_cap);
  value = map(value, min_cap, max_cap, 0, 1000);   
  return value;
}
