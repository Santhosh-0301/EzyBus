import urllib.request
import json
import re

MOCK_ROUTES = [
    {
        'id': 'r1', 'stops': [
            {'lat': 13.0827, 'lng': 80.2707}, {'lat': 13.0732, 'lng': 80.2609},
            {'lat': 13.0524, 'lng': 80.2606}, {'lat': 13.0068, 'lng': 80.2206},
            {'lat': 12.9941, 'lng': 80.1709} ]
    },
    { 'id': 'r2', 'stops': [ {'lat': 13.0408, 'lng': 80.2337}, {'lat': 13.0294, 'lng': 80.2186}, {'lat': 13.0068, 'lng': 80.2206} ] },
    { 'id': 'r3', 'stops': [ {'lat': 13.0892, 'lng': 80.2102}, {'lat': 13.0511, 'lng': 80.2124}, {'lat': 13.0294, 'lng': 80.2186}, {'lat': 12.9516, 'lng': 80.1462}, {'lat': 12.9249, 'lng': 80.1000} ] },
    { 'id': 'r4', 'stops': [ {'lat': 13.0012, 'lng': 80.2565}, {'lat': 13.0014, 'lng': 80.2397}, {'lat': 12.9788, 'lng': 80.2209} ] },
    { 'id': 'r5', 'stops': [ {'lat': 13.0349, 'lng': 80.1553}, {'lat': 13.0511, 'lng': 80.2124}, {'lat': 13.0408, 'lng': 80.2337} ] }
]

paths = {}
for r in MOCK_ROUTES:
    coords = ';'.join([f"{s['lng']},{s['lat']}" for s in r['stops']])
    url = f"http://router.project-osrm.org/route/v1/driving/{coords}?geometries=geojson&overview=full"
    try:
        req = urllib.request.urlopen(url)
        data = json.loads(req.read().decode())
        if data.get('routes'):
            full_path = data['routes'][0]['geometry']['coordinates']
            downsampled = full_path[::5] if len(full_path) > 20 else full_path
            paths[r['id']] = [{'lat': c[1], 'lng': c[0]} for c in downsampled]
            print(f"Fetched {len(paths[r['id']])} waypoints for {r['id']}")
    except Exception as e:
        print(f"Failed {r['id']}: {e}")

with open('frontend/lib/mockService.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for rid, path in paths.items():
    path_str = json.dumps(path)
    # the regex looks for `active: <bool>, color: '<hex>',` for this specific route id
    pattern = rf"(id:\s*'{rid}'.*?active:\s*(?:true|false),\s*color:\s*'.*?',)"
    replacement = rf"\g<1> path: {path_str},"
    text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open('frontend/lib/mockService.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done writing OSRM paths to mockService.ts')
