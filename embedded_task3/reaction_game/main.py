from machine import Pin
from time import sleep, ticks_ms
import random


led = Pin(15, Pin.OUT)


button = Pin(14, Pin.IN, Pin.PULL_UP)

while True:
    print("Get ready...")

    
    led.value(1)

    
    sleep(random.uniform(1, 5))

    
    led.value(0)

    start = ticks_ms()  

    
    while button.value() == 1:
        pass

    reaction_time = ticks_ms() - start
    print("Your reaction time:", reaction_time, "ms")

    sleep(2)
