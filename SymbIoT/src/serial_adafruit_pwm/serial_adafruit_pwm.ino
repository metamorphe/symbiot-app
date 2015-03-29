#include <Arduino.h>

#include <Wire.h>
#include "Adafruit_PWMServoDriver.h"

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(0x40);

// Open a serial connection and flash LED when input is received

void setup(){
  Serial.begin(115200);
  // Serial.println("16 channel PWM test!");

  // if you want to really speed stuff up, you can go into 'fast 400khz I2C' mode
  // some i2c devices dont like this so much so if you're sharing the bus, watch
  // out for this!

  pwm.begin();
  pwm.setPWMFreq(1600);  // This is the maximum PWM frequency
    
  // save I2C bitrate
  uint8_t twbrbackup = TWBR;
  // must be changed after calling Wire.begin() (inside pwm.begin())
  TWBR = 12; // upgrade to 400KHz!


  for (uint8_t pwmnum=0; pwmnum < 16; pwmnum++) {
    pwm.setPWM(pwmnum, 0, 0 );
  }
  // pinMode(13, OUTPUT);
  // pinMode(3, OUTPUT);
  // pinMode(5, OUTPUT);
  // pinMode(6, OUTPUT);

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
    value = map(value, 0, 1001, 0, 4096);
    
    // Serial.println(value);
    // analogWrite(key, value);
    pwm.setPWM(key, 0, value);
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


  // for(int i = 0; i < 1000; i++){
  //   itoa(i, buffer, 10);
  //   process("1", buffer);
  //   process("2", buffer);
  //   process("3", buffer);
  //   process("4", buffer);
  //   process("5", buffer);
  //   process("6", buffer);
  //   process("7", buffer);
  // }
    
}
