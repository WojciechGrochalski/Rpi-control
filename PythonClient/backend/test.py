import datetime

from Rpi import Rpi
from datetime import datetime

time = '2021-07-04 18:06:34.301652'
lastactivity = datetime.strptime(time, '%Y-%m-%d %H:%M:%S.%f')

print(lastactivity)
print(type(lastactivity))

now = datetime.now()
#now = now.strftime('%Y-%m-%d %H:%M:%S.%f')

print(type(now))
print(f'{lastactivity=}')
print(f'{datetime.now=}')
diff = now - lastactivity
print(f'{diff.seconds=}')
