from flask import Flask, Response
import os
import main as m
import threading
import time

app = Flask(__name__)

@app.route("/wav")
def streamwav():
    print("connected")
    while True:
        if str(os.environ.get("NOW_PLAYING")) != "":
            time.sleep(4)
            break
    print("streaming")
    time_started = float(os.environ.get("TIME_STARTED"))
    filename = os.environ.get("NOW_PLAYING")

    def generate():
        if str(os.environ.get("NOW_PLAYING")) != "":
            with open(filename, "rb") as fwav:
                curr_time = float(time.time())
                elapsed_time = curr_time - time_started
                skip_bytes = int(elapsed_time * 24000) - 1024
                data = fwav.seek(skip_bytes)
                data = fwav.read(1024)
                while data:
                    yield data
                    data = fwav.read(1024)

    # disallow pausing of stream
    return Response(generate(), mimetype="audio/x-wav")


if __name__ == "__main__":
    threading.Thread(target=m.main).start()
    app.run(debug=False)
