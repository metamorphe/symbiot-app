#include "socket.h"

#define TIMEOUT 3000

/* rF configuration */
RF24 radio(9,10); 
RF24Network network(radio);

char buffer[32];
RF24NetworkHeader header;
uint8_t num_lines;

static void send_alloc_message (uint16_t, uint16_t, uint8_t);
static void send_line_message (uint16_t, uint16_t, blinkm_script_line *);

int
setup_blinkM ()
{
  BlinkM_beginWithPower ();
  BlinkM_setAddress (blinkm_addr);
  
  Serial.begin(19200); 
  int rc = BlinkM_checkAddress( blinkm_addr );
  
  if( rc == -1 ) 
    Serial.println("\r\nno response");
  else if( rc == 1 )
    Serial.println("\r\naddr mismatch");

  return -1;
}

int
setup_radio (uint16_t node_addr)
{
  radio.begin ();
  radio.setRetries (15,15);
  network.begin (90, node_addr);
  return 1;
}

int
receive()
{
  network.update();
  if (!radio.available ())
    return 0;

  network.read (header, &buffer, sizeof(buffer));
  printf_P (PSTR ("%lu: APP Received message of type %c from %u\n\r"), millis (),
                  header.type, header.from_node);
  if (header.type == 'A')
    num_lines = (uint8_t) buffer[0];
  return 1;
}

void
send (uint16_t to_node, uint16_t from_node, blinkm_script_line *src,
      uint8_t num_lines)
{
  send_alloc_message (to_node, from_node, num_lines);
  for (int i = 0; i < num_lines; i++)
  {
    send_line_message (to_node, from_node, src + i);
  }
}

static void
send_alloc_message (uint16_t to_node, uint16_t from_node,
                    uint8_t num_lines)
{
  header.to_node = to_node;
  header.from_node = from_node;
  header.type = 'A';
  uint8_t _num_lines = num_lines;
  bool ok = network.write (header, &_num_lines, sizeof (num_lines));
  if (ok)
    printf_P(PSTR("%lu: APP Send alloc message ok\n\r"), millis ());
  else
    printf_P(PSTR("%lu: APP Send alloc message failed\n\r"), millis ());
}

static void
send_line_message(uint16_t to_node, uint16_t from_node,
                  blinkm_script_line *line)
{
  header.to_node = to_node;
  header.from_node = from_node;
  header.type = 'L';
  bool ok = network.write (header, line, sizeof (line));
  if (ok)
    printf_P(PSTR("%lu: APP Send line message ok\n\r"), millis());
  else
    printf_P(PSTR("%lu: APP Send line message failed\n\r"), millis());
}
