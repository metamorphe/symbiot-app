#include "config.h"
#include "interpreter.h"

/* Main Code */

void setup()
{
  setup_blinkM();
  setup_radio();
  READ_HEAD_BUF = (lightscript_header *) malloc(sizeof(lightscript_header) * 8);
  if (!READ_HEAD_BUF) { Serial.println("ERROR: could not allocate READ_HEAD_BUF"); }
}

void loop()
{
    receive();
    
    //temporary: check for button input and send if necessary
    if (digitalRead(buttonInput) == HIGH) {
      unsigned long pressTime = millis();
      if (pressTime - lastPress > 1000) {
        lastPress = pressTime;
        Serial.print("Button pressed. Broadcasting behavior.\r\n");
        BlinkM_writeScript( blinkm_addr, 0, script2_len, 0, script2_lines);
        BlinkM_playScript( blinkm_addr, 0,1,0 );
        send_LB(script2_lines, script2_len, 0);
        Serial.print("\r\ncmd>");
      }
    }
    if (digitalRead(delayButtonInput) == HIGH) {
      unsigned long pressTime = millis();
      if (pressTime - lastPress > 1000) {
        lastPress = pressTime;
        Serial.print("Button pressed. Broadcasting behavior.\r\n");
        BlinkM_writeScript( blinkm_addr, 0, script2_len, 0, script2_lines);
        BlinkM_playScript( blinkm_addr, 0,1,0 );
        send_LB(script2_lines, script2_len, 2);
        Serial.print("\r\ncmd>");
      }
    }
        
  
    //read the serial port and create a string out of what you read
    if( readSerialString() ) {
        Serial.println(serInStr);
        char cmd = serInStr[0];
        int num = atoi(serInStr+1);
        if ( cmd == 'p' ) {
          Serial.println("Sending command on serial to blinkM...");
          BlinkM_writeScript( blinkm_addr, 0, script1_len, 0, script1_lines);
          Serial.println("Sent. Playing script...");
          BlinkM_playScript( blinkm_addr, 0,1,0 );
          Serial.print("\r\ncmd>");
        }
        else if ( cmd == 's') {
          send_LB(script2_lines, script2_len, 0);
          Serial.print("\r\ncmd>");
        }
        else if( cmd == 'o' ) {
          Serial.println("Stopping Script 0");
          BlinkM_stopScript( blinkm_addr );
          Serial.print("\r\ncmd>");
        }
        else if( cmd =='0' ) {
            Serial.println("Fade to black");
            BlinkM_fadeToRGB( blinkm_addr, 0,0,0);
            Serial.print("\r\ncmd>");
        }
        else if( cmd =='f' ) {
            Serial.println("Flash red");
            BlinkM_writeScript( blinkm_addr, 0, flash_red_len, 0, flash_red_lines);
            BlinkM_playScript( blinkm_addr, 0,1,0 );
            Serial.print("\r\ncmd>");
        }
    }
}



void help()
{
  Serial.println("\r\nBlinkMScriptWriter!\r\n"
                 "'p' to write the script and play once\r\n"
                 "'s' to send the script to nearby nodes\r\n"
                 "'o' to stop script playback\r\n"
                 "'0' to fade to black\r\n"
                 "'f' to flash red\r\n"
                 );
}



