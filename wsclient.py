import websocket

#websocket.enableTrace(True)
ws = websocket.WebSocket()

ws.connect("ws://localhost:8081/", origin="testing_websockets.com")
for i in range(10):
    ws.send(f"Hello, Server {i}")
    print(ws.recv())

ws.close()
