from machine import Pin
from time import sleep


red = Pin(15, Pin.OUT)
yellow = Pin(14, Pin.OUT)
green = Pin(13, Pin.OUT)


button = Pin(12, Pin.IN, Pin.PULL_UP)


buzzer = Pin(11, Pin.OUT)

def traffic_lights():
   
    red.value(1)
    sleep(2)
    red.value(0)

    yellow.value(1)
    sleep(1)
    yellow.value(0)

    green.value(1)
    sleep(2)
    green.value(0)

while True:

    if button.value() == 0:
        # Emergency mode
        red.value(1)
        buzzer.value(1)
        sleep(2)
        buzzer.value(0)
        red.value(0)
    else:
        traffic_lights()
