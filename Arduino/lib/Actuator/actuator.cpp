/*
 *  Actuator Interface - Header File
 *	------------------------------------
 *  Describes an actuator that receives one signal line (DC || PWM)
 *  An actuator is its own controller; outside controllers activate its behaviors. 
 *  For now, a behavior is defined as a sequence of integers [0, 1000]
 *  It regulates its own voltage thresholds
 */ 
#include "Actuator.h"
#include "Logger.h"


Actuator::Actuator(String _name, unsigned int _pin, unsigned int _vmin, unsigned int _vmax){
  pin = _pin;
  vmin = _vmin; // Arduino 0 --> always off load
  vmax = _vmax; // Arduino 255 --> always on load
  value = 0;
  pos = 0;
  play = false;
  repeat = true;
  Serial.print("Setup: " );
  Serial.print(vmin);
  Serial.print(" ");
  Serial.println(vmax);
  name = _name;
  init();
} 

void Actuator::init(){
  pinMode(pin, OUTPUT);
}


void Actuator::print(){
  Serial.print("Actuator ");
  Serial.print(": { value: ");
  Serial.print(value);
  Serial.println("}");
}

void Actuator::evaluate( SDLogger& sd){
  // internal_log->write(name, sd);
  active_behavior->write(name, sd);
}

void Actuator::set(Logger* _behavior){
  playable(false);
  active_behavior = _behavior;
  internal_log = new Logger(*_behavior); 
  go_to_pos(0);
}

void Actuator::actuate(unsigned int value, unsigned long delay_t){
  Serial.print("Actuating ");
  Serial.print(value);
  Serial.print(" delayed ");
  Serial.println(delay_t);
  Serial.print(" @ ");
  Serial.println(delay_t);

  value = map(value, 0, 1000, vmin, vmax);
  analogWrite(pin, value);
  internal_log->log(value);  
  delay(delay_t);  
}

void  Actuator::go_to_pos(int _pos){ 
	if(_pos < 0) _pos = length() + _pos; 
	pos = _pos;
}

InterruptRecord temp;
// TODO: Add x # of repeats; currently inf. repeats
void Actuator::next(unsigned long t0){
	if(!play) return;
	if(repeat && pos >= length()){
		go_to_pos(0);
  } else if (!repeat && pos >= length()) {
  	playable(false);
  	go_to_pos(0);
  	return;
	}
  temp = active_behavior->getIR(pos);

	actuate(temp.curr, temp.delay);
	pos++;
}
