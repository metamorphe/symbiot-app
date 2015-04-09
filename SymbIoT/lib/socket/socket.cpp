#include "socket.h"

#define TIMEOUT 3000

/* rF configuration */
RF24 radio(9,10); 
RF24Network network(radio);

blinkm_script_line buffer[16];
RF24NetworkHeader *most_recent_header;
uint8_t num_lines;
static uint8_t current_line_num;

static void send_alloc_message (uint16_t, uint16_t, uint8_t);
static void send_line_message (uint16_t, uint16_t, blinkm_script_line *);
static void send_end_message (uint16_t, uint16_t);

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
  if (!network.available ())
    return 0;

  RF24NetworkHeader header;
  network.peek(header);
  printf_P (PSTR ("%lu: APP Received message of type %c from % "PRIu16 "\n\r"),
                    millis (), header.type, header.from_node);
  *most_recent_header = header;
  // TODO: functionalize handlers
  switch (header.type)
  {
    case 'A':
      network.read (header, &num_lines, sizeof (num_lines));
      break;
    case 'L':
      // TODO: increment buffer pointer per line read
      network.read (header, &(buffer[current_line_num]),
                    sizeof (blinkm_script_line));
      current_line_num++;
      break;
    case 'E':
      current_line_num = 0;
      network.read (header, NULL, 0);
      break;
    default:
      printf_P(PSTR("*** WARNING *** Unknown message type %c\n\r"),header.type);
      network.read(header,0,0);
      break;
  }
  return 1;
}

void
send (uint16_t to_node, uint16_t from_node, blinkm_script_line *src,
      uint8_t num_lines)
{
  printf_P(PSTR("%lu: APP Begin message from %" PRIu16 " to %" PRIu16 ".\n\r"),
                millis (), from_node, to_node);
  send_alloc_message (to_node, from_node, num_lines);
  for (int i = 0; i < num_lines; i++)
  {
    send_line_message (to_node, from_node, src + i);
  }
  send_end_message (to_node, from_node);
}

static void
send_alloc_message (uint16_t to_node, uint16_t from_node,
                    uint8_t num_lines)
{
  RF24NetworkHeader header(to_node, 'A');
  header.from_node = from_node;
  uint8_t _num_lines = num_lines;
  bool ok = network.write (header, &_num_lines, sizeof (_num_lines));
  if (ok)
    printf_P(PSTR("%lu: APP Send alloc message ok\n\r"), millis ());
  else
    printf_P(PSTR("%lu: APP Send alloc message failed\n\r"), millis ());
}

static void
send_line_message(uint16_t to_node, uint16_t from_node,
                  blinkm_script_line *line)
{
  RF24NetworkHeader header(to_node, 'L');
  header.from_node = from_node;
  bool ok = network.write (header, line, sizeof (*line));
  if (ok)
    printf_P(PSTR("%lu: APP Send line message ok\n\r"), millis());
  else
    printf_P(PSTR("%lu: APP Send line message failed\n\r"), millis());
}

static void
send_end_message (uint16_t to_node, uint16_t from_node)
{
  RF24NetworkHeader header(to_node, 'E');
  header.from_node = from_node;
  bool ok = network.write (header, NULL, 0);
  if (ok)
    printf_P(PSTR("%lu: APP Send end message ok\n\r"), millis ());
  else
    printf_P(PSTR("%lu: APP Send end message failed\n\r"), millis ());
}