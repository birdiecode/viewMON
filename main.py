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
                    await websocket.send(json.dumps({"method": "set_data", "data": {"dev": dev, "info": "information about the "+dev+" device not found"}}))
                    print("no dev: "+dev)


async def main():
    async with websockets.serve(echo, "0.0.0.0", 8001):
        await asyncio.Future()


asyncio.run(main())
