import socket, os
import threading, wave, pyaudio, time
import main as alradio
import json

host_name = socket.gethostname()
host_ip = socket.gethostbyname(host_name)
port = 5000
meta_port = 5001


SOCKETS = []
META_SOCKETS = []
META_SENT = set()

def gather_sockets(server_socket, BUFF_SIZE, meta=False):
    
    while True:
        _, addr = server_socket.recvfrom(BUFF_SIZE)
        if not meta and addr not in SOCKETS:
            SOCKETS.append(addr)
            print("new socket", addr)
        elif meta and addr not in META_SOCKETS:
            META_SOCKETS.append(addr)
            print("new meta socket", addr)

def send_data_to_sockets(server_socket, data, meta=False):
    if not meta:
        for addr in SOCKETS:
            server_socket.sendto(data, addr)
    else:
        for addr in META_SOCKETS:
            if addr not in META_SENT and data != "":
                server_socket.sendto(data.encode(), addr)
                META_SENT.add(addr)


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
                break

            threading.Thread(target=send_data_to_sockets, args=(server_socket, data)).start()
            time.sleep(0.87 * CHUNK/sample_rate)
            

def metadata_UDP():  
    # create socket for metadata
    server_socket = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
    server_socket.bind((host_ip, (meta_port)))
    print('server listening at',(host_ip, (meta_port)))
    threading.Thread(target=gather_sockets, args=(server_socket, 1024, True)).start()
    old_data = ""
    while True:
        time.sleep(2)  
        new_data = os.environ.get('NOW_PLAYING_DATA')
        if new_data != old_data:
            META_SENT.clear()
            old_data = new_data
        
        send_data_to_sockets(server_socket, new_data, True)





                
threading.Thread(target=alradio.main).start()
threading.Thread(target=audio_stream_UDP, args=()).start() # stream port
threading.Thread(target=metadata_UDP, args=()).start() # metadata port

