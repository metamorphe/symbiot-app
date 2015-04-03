#include "variables.h"
#include <Arduino.h>
#include "BlinkM.h"
#include "socket.h"

#define IS_DIGIT(c) ((c >= '0' && c <= '9') ? 1 : 0)
#include "printf.h"

// Function prototypes
void help (void);
uint8_t readSerialString (void);
void handle_button_press (void);
void handle_alloc_message (void);
void handle_line_message (void);
void actuate (void);
uint8_t readSerialString (void);

uint16_t this_node;
int received;
char serInStr[32];

/* Main Code */

void setup()
{
  /* IMPORTANT: address must be specified for all uploads. */
  this_node = 01;

	setup_blinkM ();    
	setup_radio (this_node);
  printf_begin ();
  help ();
  Serial.print("cmd>");
}

void loop()
{
	received = receive ();

  // if (received)
  //   actuate ();
  
    //read the serial port and create a string out of what you read
  if( readSerialString() ) {
    Serial.println(serInStr);
    char cmd = serInStr[0];
    if ( cmd == 'p' ) {
      Serial.println("Sending command on serial to blinkM...");
      BlinkM_writeScript( blinkm_addr, 0, script1_len, 0, script1_lines);
      Serial.println("Sent. Playing script...");
      BlinkM_playScript( blinkm_addr, 0,1,0 );
      Serial.print("\r\ncmd>");
    }
    else if (IS_DIGIT(cmd)) {
      uint16_t num = cmd - '0';
      if (num > 01)
        Serial.println("Invalid destination node address.");
      else
        send (num, this_node, script2_lines, script2_len);
      Serial.print("\r\ncmd>");
    }
    else if( cmd == 'o' ) {
      Serial.println("Stopping Script 0");
      BlinkM_stopScript( blinkm_addr );
      Serial.print("\r\ncmd>");
    }
    else if( cmd =='x' ) {
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

void
help (void)
{
  Serial.println("\r\nBlinkMScriptWriter!\r\n"
	 "'p' to write the script and play once\r\n"
	 "'<node address>' to send the script to a specified node\r\n"
	 "'o' to stop script playback\r\n"
	 "'x' to fade to black\r\n"
	 "'f' to flash red\r\n"
   ); 
}

void
actuate (void)
{
  BlinkM_writeScript  (blinkm_addr, 0, num_lines, 0,
                      (blinkm_script_line *) buffer);
  BlinkM_playScript (blinkm_addr, 0, 1,0);
}

// TODO: refactor for unicasting
// void handle_button_press(void)
// {
//   if (digitalRead(buttonInput) == HIGH) {
//     unsigned long pressTime = millis();
//     if (pressTime - lastPress > 1000) {
//       lastPress = pressTime;
//       Serial.print("Button pressed. Broadcasting behavior.\r\n");
//       BlinkM_writeScript( blinkm_addr, 0, script2_len, 0, script2_lines);
//       BlinkM_playScript( blinkm_addr, 0,1,0 );
//       send(script2_lines, script2_len, 0);
//       Serial.print("\r\ncmd>");
//     }
//   }
//   if (digitalRead(delayButtonInput) == HIGH) {
//     unsigned long pressTime = millis();
//     if (pressTime - lastPress > 1000) {
//       lastPress = pressTime;
//       Serial.print("Button pressed. Broadcasting behavior.\r\n");
//       BlinkM_writeScript( blinkm_addr, 0, script2_len, 0, script2_lines);
//       BlinkM_playScript( blinkm_addr, 0,1,0 );
//       send(script2_lines, script2_len, 2);
//       Serial.print("\r\ncmd>");
//     }
//   }
// }

uint8_t
readSerialString (void)
{
  if(!Serial.available()) {
    return 0;
  }
  delay(10);  // wait a little for serial data
  int i = 0;
  while (Serial.available()) {
    serInStr[i] = Serial.read();   // FIXME: doesn't check buffer overrun
    i++;
  }
  serInStr[i] = 0;  // indicate end of read string
  return i;  // return number of chars read
}



