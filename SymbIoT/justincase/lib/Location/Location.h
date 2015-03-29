/**
 * Location.h
 * 
 * More info goes here
 *
 */

#ifndef Location_h
#define Location_h

#include "Arduino.h"

class Location {

  public:
    char *getName();
    struct coordinates *getCoords();
    void setName(char *);
    void setCoords(float, float);
          
  private:
    char *_name;
    struct coordinates _coordinates;
    
};

struct coordinates {
    float x;
    float y;
};

#endif