//
//  Button.cpp
//  Buttons
//
//  Created by Cesar Torres on 7/2/14.
//  Copyright (c) 2014 Cesar Torres. All rights reserved.
//

#include "Button.h"
long debounceDelay = 50;

Button::Button(String _name, unsigned int _pin, boolean _debounceable){
  name = _name;
  debounceable = _debounceable;
  pin = _pin;
  init();
} 

void Button::init(){
  pinMode(pin, INPUT);
  state = BUTTON_UP;
  last_state = BUTTON_UP;
}

void Button::print(){
  Serial.print("Button ");
  Serial.print(name);
  Serial.print(": ");
  Serial.println(state);
}
void Button::update(boolean u_state){
  if(state == BUTTON_DOWN){
    switch (u_state) {
      case 0:
        state = BUTTON_LEAVE;
        break;
    }
  }
  else if(state == BUTTON_UP){
    switch (u_state) {
      case 1:
        state = BUTTON_ENTER;
        break;
    }
  }
  else if(state == BUTTON_LEAVE){
    switch (u_state) {
      case 0:
        state = BUTTON_UP;
        break;
      case 1:
        state = BUTTON_ENTER;
        break;
    }
  }
  else if(state == BUTTON_ENTER){
    switch (u_state) {
      case 0:
        state = BUTTON_LEAVE;
        break;
      case 1:
        state = BUTTON_DOWN;
        break;
    }
  }
}
bool Button::read(){
  if(debounceable){
    int reading = digitalRead(pin);
    if (reading != last_state)
    LDT = millis();
  
    if ((millis() - LDT) > debounceDelay)
      state = reading;

    last_state = reading;
  }
  else{
      this->update(digitalRead(pin));    
  }
  return this;
}
