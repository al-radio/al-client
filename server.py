import socket, os
import threading, wave, pyaudio, time
import main as alradio

host_name = socket.gethostname()
host_ip = socket.gethostbyname(host_name)
print(host_ip)
port = 5000

SOCKETS = []

def gather_sockets(server_socket, BUFF_SIZE):
    
    while True:
        _, addr = server_socket.recvfrom(BUFF_SIZE)
        if addr not in SOCKETS:
            SOCKETS.append(addr)
            print("new socket", addr)

def send_data_to_sockets(server_socket, data):
    for addr in SOCKETS:
        server_socket.sendto(data, addr)

def close_unused_sockets():
    while True:
        for addr in SOCKETS:
            if addr not in alradio.CONNECTIONS:
                SOCKETS.remove(addr)
                print("removed socket", addr)
        time.sleep(10)

def audio_stream_UDP():
    BUFF_SIZE = 65536
    server_socket = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
    server_socket.setsockopt(socket.SOL_SOCKET,socket.SO_RCVBUF,BUFF_SIZE)

    server_socket.bind((host_ip, (port)))
    CHUNK = 10*1024
    print('server listening at',(host_ip, (port)))

    threading.Thread(target=gather_sockets, args=(server_socket, BUFF_SIZE)).start()


    while True: # loop that sends audio data to the client in chunks
        while str(os.environ.get('NOW_PLAYING', "")) == "":
            pass
        filename = str(os.environ.get('NOW_PLAYING'))
        #filename = "media/2022-11-08 21:02:05.450878$delim$47 - Remastered - Sunny Day Real Estate.wav"

        wf = wave.open(filename)
        p = pyaudio.PyAudio()

        stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                        channels=wf.getnchannels() - 1,
                        rate=wf.getframerate(),
                        input=True,
                        frames_per_buffer=CHUNK)

        data = None
        sample_rate = wf.getframerate()

        while True:
            data = wf.readframes(CHUNK) 
            if not data:
                os.environ['NOW_PLAYING'] = ""
                time.sleep(2)
                break

            threading.Thread(target=send_data_to_sockets, args=(server_socket, data)).start()
            time.sleep(0.91 * CHUNK/sample_rate)
            
           
                
threading.Thread(target=alradio.main).start()
threading.Thread(target=audio_stream_UDP, args=()).start()
