import sys
import json
import ephem
from datetime import timezone

ephemeris = {
    'solstices': [],
    'new_moons': []
}

date = ephem.date('1970-01-01') # Unix Epoch
while date < ephem.date('2033-05-18'): # 2 gigaseconds later
    date = ephem.next_solstice(date)
    time = int(date.datetime().replace(tzinfo=timezone.utc).timestamp() * 1000)
    ephemeris['solstices'].append(time)

date = ephem.date('1970-01-01') # Unix Epoch
while date < ephem.date('2033-05-18'): # 2 gigaseconds later
    date = ephem.next_new_moon(date)
    time = int(date.datetime().replace(tzinfo=timezone.utc).timestamp() * 1000)
    ephemeris['new_moons'].append(time)

with open('ephemeris.json', 'w') as f:
    json.dump(ephemeris, f, indent=2)
