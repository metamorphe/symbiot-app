#include "command.h"

static void command_self_flash_helper (uint8_t, uint8_t, uint8_t);

void
command_set_color (uint16_t to_node, uint16_t from_node,
                   uint8_t red_val, uint8_t green_val,
                   uint8_t blue_val)
{
  blinkm_script_line set_line = { 1, { 'n', red_val, green_val, blue_val} };
  send (to_node, from_node, &set_line, 1);
}

void command_set_intensity (uint16_t to_node, uint16_t from_node,
                            int percentage)
{
  percentage = constrain (percentage, 0, 100);
  uint16_t normalized = (uint16_t) map (percentage, 0, 100, 0, 255);
  command_set_color (to_node, from_node, normalized, normalized,
                     normalized);
}

void
command_turn_on (uint16_t to_node, uint16_t from_node)
{
  command_set_color (to_node, from_node, 0xff, 0xff, 0xff);
}

void
command_turn_off (uint16_t to_node, uint16_t from_node)
{
  command_set_color (to_node, from_node, 0x00, 0x00, 0x00);
}

void
command_fade_to_color (uint16_t to_node, uint16_t from_node,
                   uint8_t red_val, uint8_t green_val,
                   uint8_t blue_val)
{
  blinkm_script_line set_line = { 1, { 'c', red_val, green_val, blue_val} };
  send (to_node, from_node, &set_line, 1);
}

void command_fade_to_intensity (uint16_t to_node, uint16_t from_node,
                            int percentage)
{
  percentage = constrain (percentage, 0, 100);
  uint16_t normalized = (uint16_t) map (percentage, 0, 100, 0, 255);
  command_fade_to_color (to_node, from_node, normalized, normalized,
                     normalized);
}

void
command_fade_on (uint16_t to_node, uint16_t from_node)
{
  command_fade_to_color (to_node, from_node, 0xff, 0xff, 0xff);
}

void
command_fade_off (uint16_t to_node, uint16_t from_node)
{
  command_fade_to_color (to_node, from_node, 0x00, 0x00, 0x00);
}

static void
command_self_flash_helper (uint8_t red_val, uint8_t green_val,
                           uint8_t blue_val)
{
  blinkm_script_line set_lines[] =
  {
    { 10, { 'n', red_val, green_val, blue_val} },
    { 5, { 'n', 0x00, 0x00, 0x00} },
    { 10, { 'n', red_val, green_val, blue_val} },
    { 5, { 'n', 0x00, 0x00, 0x00} }
  };
  BlinkM_writeScript (blinkm_addr, 0, 4, 0, set_lines);
  BlinkM_playScript (blinkm_addr, 0,1,0 );
}

void command_self_flash_red (void)
{
  command_self_flash_helper (0xff, 0x00, 0x00);
}

void command_self_flash_green (void)
{
  command_self_flash_helper (0x00, 0xff, 0x00);
}

void command_self_flash_blue (void)
{
  command_self_flash_helper (0x00, 0x00, 0xff);
}

void command_self_flash_yellow (void)
{
  command_self_flash_helper (0xff, 0xff, 0x00);
}

void command_self_flash_white (void)
{
  command_self_flash_helper (0xff, 0xff, 0xff);
}
