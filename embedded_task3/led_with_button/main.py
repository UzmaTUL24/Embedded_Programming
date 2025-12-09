from machine import Pin

led = Pin(15, Pin.OUT)
button = Pin(14, Pin.IN, Pin.PULL_UP)

while True:
    if button.value() == 0:  
        led.value(1)
    else:
        led.value(0)
