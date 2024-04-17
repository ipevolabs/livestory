import websocket

#websocket.enableTrace(True)
ws = websocket.WebSocket()

ws.connect("ws://localhost:8081/", origin="testing_websockets.com")
while True:
    print(ws.recv())

ws.close()
