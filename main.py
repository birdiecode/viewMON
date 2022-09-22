#!/usr/bin/python3
import json
import asyncio
import websockets


async def echo(websocket):
    async for message in websocket:
        data = json.loads(message)
        if data["method"] == "get_data":
            for dev in data['data']:
                try:
                    with open('/var/run/viewmon/'+dev) as devinfo:
                        await websocket.send(json.dumps({"method": "set_data", "data": {"dev": dev, "info": devinfo.read()}}))
                except Exception:
                    await websocket.send(json.dumps(
                        {"method": "set_data", "data": {"dev": dev, "info": "information about the "+dev+" device not found"}}))
                    print("no dev: "+dev)
        elif data["method"] == "get_settings":
            try:
                with open('/etc/viewmon/grid.cfg') as gridinfo:
                    grid = {"status": "ok", "grid": []}
                    for line in gridinfo:
                        line = line.replace("\n", "")
                        if line[0] == "#":
                            continue

                        sline = line.split(" ")
                        grid['grid'].append([int(sline[0]), int(sline[1]), int(sline[2]), int(sline[3]), int(sline[4]), int(sline[5]), sline[6]])
                    await websocket.send(json.dumps(
                        {"method": "set_grid", "data": grid}))
            except Exception:
                await websocket.send(json.dumps(
                    {"method": "set_grid", "data": {"status": "error", "info": "configuration error"}}))



async def main():
    async with websockets.serve(echo, "0.0.0.0", 8001):
        await asyncio.Future()


asyncio.run(main())
