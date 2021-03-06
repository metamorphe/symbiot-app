#include <Arduino.h>
#include "variables.h"
#include "BlinkM.h"
#include "socket.h"
#include "scheduler.h"

#define IS_DIGIT(c) ((c >= '0' && c <= '9') ? 1 : 0)
#define SERIAL_BUFFER_SIZE 32
#include "printf.h"

/* Function prototypes. */
void help (void);
void welcome_message(void);
uint8_t readSerialString (void);
void actuate (void);

uint16_t this_node;
int received;
char serInStr[SERIAL_BUFFER_SIZE];

/* Main Code */

void 
welcome_message(void)
{
  Serial.print("Welcome! This node's id is: 0");
  Serial.println (this_node, OCT);
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

void setup()
{
  /* Begin all communication, read EEPROM, and print address. */
  Serial.begin (19200);
  printf_begin ();
  help ();
  this_node = nodeconfig_read ();
  welcome_message ();

  /* BlinkM overhead */
  setup_blinkM ();
  BlinkM_setStartupParamsDefault (blinkm_addr);
  // BlinkM_stopScript( blinkm_addr );
  // BlinkM_fadeToRGB (blinkm_addr, 0, 0, 0);

  setup_radio (this_node);
  Serial.print("cmd>");
}

void loop()
{
  received = receive ();

  if (received && most_recent_header->type == 'E')
  {
    actuate ();
    Serial.print ("\r\ncmd>");
  }
  
    //read the serial port and create a string out of what you read
  if (readSerialString ())
  {
    char cmd = serInStr[0];
    Serial.print ("\r\n");

    if ( cmd == 'p' )
    {
      Serial.println("Sending command on serial to blinkM...");
      BlinkM_writeScript( blinkm_addr, 0, script1_len, 0, script1_lines);
      Serial.println("Sent. Playing script...");
      BlinkM_playScript( blinkm_addr, 0,1,0 );
      Serial.print("\r\ncmd>");
    }
    else if (IS_DIGIT(cmd))
    {
      uint16_t num = cmd - '0';
      if (num > 8)
        Serial.println("Invalid destination node address.");
      else
        send (num, this_node, script2_lines, script2_len);
      Serial.print("\r\ncmd>");
    }
    else if( cmd == 'o' )
    {
      Serial.println("Stopping Script 0");
      BlinkM_stopScript( blinkm_addr );
      Serial.print("\r\ncmd>");
    }
    else if( cmd =='x' )
    {
      Serial.println ("Fade to black");
      BlinkM_fadeToRGB (blinkm_addr, 0, 0, 0);
      Serial.print ("\r\ncmd>");
    }
    else if( cmd =='f' )
    {
      Serial.println ("Flash red");
      command_self_flash_red ();
      Serial.print ("\r\ncmd>");
    }
    else if (cmd =='s')
    {
      //go to scheduling routine!
      Serial.print ("Will parse: ");
      Serial.println (serInStr);
      schedulder_parse_key_value  (serInStr, SERIAL_BUFFER_SIZE, this_node);
      Serial.print ("\r\ncmd>");
    }
    else if (cmd == '\n' || cmd == '\r')
    {
      Serial.print ("\r\ncmd>");
    }
    else
    {
      Serial.print ("Command" ); 
      Serial.print (cmd);
      Serial.println (" received, but not understood.");
      Serial.print ("\r\ncmd>");
    }
  }
}

void
actuate (void)
{
  BlinkM_writeScript (blinkm_addr, 0, num_lines, 0,
                      (blinkm_script_line *) buffer);
  BlinkM_playScript (blinkm_addr, 0, 1,0);
}

uint8_t
readSerialString (void)
{
  if (!Serial.available ())
    return 0;
  delay (10);  // wait a little for serial data
  uint8_t i = 0;
  char c;
  while (1)
  {
    if (!Serial.available ())
      continue;
    c = Serial.read ();
    if (i >= (SERIAL_BUFFER_SIZE - 1))
    { //need extra byte to hold terminating 0
      Serial.println ("Serial buffer overflow!");
      break;
    }
    Serial.print (c);
    serInStr[i] = c;
    i++;
    if (c == '\n' || c == '\r')
      break;
  }
  serInStr[i] = '\0';  // indicate end of read string
  return i;  // return number of chars read
}
