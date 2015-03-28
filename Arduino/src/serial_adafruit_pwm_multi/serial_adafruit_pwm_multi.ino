#include <Arduino.h>

#include <Wire.h>
#include "Adafruit_PWMServoDriver.h"

Adafruit_PWMServoDriver light_a = Adafruit_PWMServoDriver(0x40);
Adafruit_PWMServoDriver light_b = Adafruit_PWMServoDriver(0x41);
Adafruit_PWMServoDriver servos = Adafruit_PWMServoDriver(0x43);

// Open a serial connection and flash LED when input is received

void setup(){
  Serial.begin(115200);

  light_a.begin();
  light_a.setPWMFreq(1600);  // This is the maximum PWM frequency
  light_b.begin();
  light_b.setPWMFreq(1600);  // This is the maximum PWM frequency
  servos.begin();
  servos.setPWMFreq(60);  // This is the maximum PWM frequency
    
  uint8_t twbrbackup = TWBR;
  TWBR = 12; // upgrade to 400KHz!


  for (uint8_t pwmnum=0; pwmnum < 16; pwmnum++) {
    light_a.setPWM(pwmnum, 0, 0 );
  }
  for (uint8_t pwmnum=0; pwmnum < 16; pwmnum++) {
    light_b.setPWM(pwmnum, 0, 0 );
  }

}

// 12 is the maximum length of a decimal representation of a 32-bit integer,
// including space for a leading minus sign and terminating null byte
char buffer[12];
String keyData = "";
String valueData = "";
int delimiter = (int) '\n';
int comma = (int) ',';
bool key = true;

void process(String keyData, String valueData){
    unsigned int n = keyData.length() + 1;
    keyData.toCharArray(buffer, n);
   
    int key = atoi(buffer);

    // Convert ASCII-encoded integer to an int
    n = valueData.length() + 1;
    valueData.toCharArray(buffer, n);
    int value = atoi(buffer);


    // value = map(value, 0, 1000, 0, 255);
    value = constrain(value, 0, 4096);
    value = map(value, 0, 1001, 0, 500);
    // value = map(value, 0, 1001, 0, 4096);
    
    // Serial.println(value);
    // analogWrite(key, value);
    
    // RESOLVE ADDRESS
    int board = key / 16;
    int addr = key % 16;
    if(board == 0)
      light_a.setPWM(addr, 0, value);
    else if(board == 1)
      light_b.setPWM(addr, 0, value);
    else if(board == 2){
      
      value = map(value, 0, 1001, 150, 525);
      // light_a.setPWM(0, 0, value);
      servos.setPWM(addr, 0, value);
    }
}
void loop() {
    while (Serial.available()) {
        int ch = Serial.read();
        if (ch == -1) {
            // Handle error
        }
        else if (ch == comma){
            key = false;
            break;
        }
        else if (ch == delimiter) {
            key = true;
            process(keyData, valueData);
            keyData = "";
            valueData = "";
            break;
        }
        else if (key){
            keyData += (char) ch;
        }
        else if(!key){
            valueData += (char) ch;
        }
    }
    
}
