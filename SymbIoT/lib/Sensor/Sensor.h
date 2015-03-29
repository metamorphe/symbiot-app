// Logging interface

#ifndef __Expresso__sensor__
#define __Expresso__sensor__

#include <Arduino.h>
class Sensor {
public:
    Sensor(unsigned int, unsigned int, unsigned int);
    void init();
    int update();
    void print();
    unsigned int value;
private:
    unsigned int max_cap;
    unsigned int min_cap;
        unsigned int pin;

};

#endif /* defined(__Expresso__sensor__) */
