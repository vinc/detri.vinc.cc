import sys
import json
import ephem

ephemeris = {
    'solstices': [],
    'new_moons': []
}

date = ephem.date('1970-01-01') # Unix Epoch
while date < ephem.date('2033-05-18'): # 2 gigaseconds later
    date = ephem.next_solstice(date)
    ephemeris['solstices'].append(int(date.datetime().timestamp() * 1000))

date = ephem.date('1970-01-01') # Unix Epoch
while date < ephem.date('2033-05-18'): # 2 gigaseconds later
    date = ephem.next_new_moon(date)
    ephemeris['new_moons'].append(int(date.datetime().timestamp() * 1000))

with open('ephemeris.json', 'w') as f:
    json.dump(ephemeris, f)
