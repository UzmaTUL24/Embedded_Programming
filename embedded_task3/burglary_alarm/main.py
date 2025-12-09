from machine import Pin
from time import sleep

# PIR output pin
pir = Pin(14, Pin.IN)  


alarm = Pin(15, Pin.OUT)

while True:
    if pir.value() == 1:   # Motion detected
        alarm.value(1)
        print("Movement detected!")
        sleep(1)
    else:
        alarm.value(0)

    sleep(0.1)
