/**
 * Bean.h
 * 
 * More info goes here
 *
 */

#ifndef Bean_h
#define Bean_h

#include "Arduino.h"
#include "Behavior.h"

class Bean {

  public:
    /* Primary use functions */
    void actuate(Behavior *);

    /* Networking auxiliary functions, used by controller */
    void setRolePingOut();
    void setRolePongBack();
          
  private:
    // Actuator _actuator; // To be implemented
    void actuateBlinkM(Behavior *); // Use BlinkM only in the mean time
    char *macAddress;
    Bean *neighbor;
    
};
#endif
