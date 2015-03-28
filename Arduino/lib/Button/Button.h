//
//  button.h
//  Basic Button Functionality
//
//  Created by Cesar Torres on 10/6/14.
//  Copyright (c) 2014 Cesar Torres. All rights reserved.
//

#ifndef __Expresso__button__
#define __Expresso__button__
#include <Arduino.h>
#include "string.h"

#define DEBOUNCE 1
#define NO_DEBOUNCE 0
// BUTTON STATES
#define BUTTON_DOWN 1
#define BUTTON_UP 0
#define BUTTON_ENTER 2
#define BUTTON_LEAVE 3

class Button {
public:
    Button(String, unsigned int, boolean);
    void init();
    bool read();
    void print();
    void update(boolean);
    unsigned int state;
private:
	String name;
	unsigned int pin;
	unsigned int last_state;
	long LDT;
    bool debounceable;
};

#endif /* defined(__Expresso__button__) */
