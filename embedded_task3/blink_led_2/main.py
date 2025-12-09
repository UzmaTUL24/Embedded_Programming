from machine import Pin, Timer
 
led = Pin(25, Pin.OUT)

def blink(timer):
    led.toggle()

Timer().init(freq=1, mode=Timer.PERIODIC, callback=blink)   
