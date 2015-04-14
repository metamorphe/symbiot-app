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

uint16_t this_node;
int received;
char serInStr[SERIAL_BUFFER_SIZE];
const short max_active_nodes = 16;
uint16_t active_nodes[max_active_nodes];
uint16_t possible_nodes[max_active_nodes] =
{
  00,
  01, 011, 021,
  02, 012, 022,
  03, 013, 023,
  04, 014, 024,
  05, 015, 025
};
const int timeout = 3000;

/* Main Code */

void 
welcome_message(void)
{
  printf_P (PSTR ("\r\nWelcome to address-finder test suite.\r\n"));
  printf_P (PSTR ("This node's id is 0%o.\r\n\r\n"), this_node);
}

void 
help (void)
{
  printf_P (PSTR ("Help:"));
  printf_P (PSTR ("Enter a hex digit nfrom 0 to f to test connection to the nth node.\r\n"));
  printf_P (PSTR ("Press 't' to connections to all nodes sequentially.\r\n"));
}

void setup()
{
  /* Begin all communication, read EEPROM, and print address. */
  Serial.begin (19200);
  printf_begin ();
  this_node = nodeconfig_read ();
  welcome_message ();
  help ();

  /* BlinkM overhead */
  setup_blinkM ();
  BlinkM_setStartupParamsDefault (blinkm_addr);
  command_self_flash_green ();

  /* Radio overhead */
  pinMode(A0, OUTPUT); // !!! only enable this if on PCB board, make sure radio is initialized
                       // as RF24(A0, 10) also !!! 
  setup_radio (this_node);
  Serial.print("cmd>");
}

void loop()
{
  received = receive ();

  if (received)
    printf_P (PSTR ("cmd>\r\n"));

  if (readSerialString ())
  {
    char cmd = serInStr[0];
    bool ok;
    Serial.print ("\r\n");
    if (IS_DIGIT(cmd))
    {
      test_connection (possible_nodes[cmd - '0'], this_node, timeout);
      Serial.print ("\r\ncmd>");
    }
    else
      switch (cmd)
      {
        case 't':
        {
          int i;
          int array_idx = 0;
          for (i = 0; i < max_active_nodes; i++)
          {
            ok = test_connection (possible_nodes[i], this_node, timeout);
            if (ok)
            {
              active_nodes[array_idx++] = possible_nodes[i];
            }
          }
          printf_P (PSTR ("Finished! Nodes on the network are:\r\n"));
          for (i = 0; i < array_idx; i++)
          {
            printf_P (PSTR ("0%o\r\n"), active_nodes[i]);
          }
          Serial.print ("\r\ncmd>");
          break;
        }
        case 'a':
          test_connection (possible_nodes[10], this_node, timeout);
          Serial.print ("\r\ncmd>");
          break;
        case 'b':
          test_connection (possible_nodes[11], this_node, timeout);
          Serial.print ("\r\ncmd>");
          break;
        case 'c':
          test_connection (possible_nodes[12], this_node, timeout);
          Serial.print ("\r\ncmd>");
          break;
        case 'd':
          test_connection (possible_nodes[13], this_node, timeout);
          Serial.print ("\r\ncmd>");
          break;
        case 'e':
          test_connection (possible_nodes[14], this_node, timeout);
          Serial.print ("\r\ncmd>");
          break;
        case 'f':
          test_connection (possible_nodes[15], this_node, timeout);
          Serial.print ("\r\ncmd>");
          break;
        default:
          printf_P (PSTR ("Unrecognized address: %c\r\n"), cmd);
          Serial.print ("\r\ncmd>");
          break;
      }
  }
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
