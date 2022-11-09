import socket
import threading, pyaudio, time, queue
import json
from pprint import pprint

host_name = socket.gethostname()
host_ip = socket.gethostbyname(host_name)
print(host_ip)
port = 5000
meta_port = 5001

q = queue.Queue(maxsize=2000)

def audio_stream_UDP():
	BUFF_SIZE = 65536
	client_socket = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
	client_socket.setsockopt(socket.SOL_SOCKET,socket.SO_RCVBUF,BUFF_SIZE)
	p = pyaudio.PyAudio()
	CHUNK = 10*1024
	stream = p.open(format=p.get_format_from_width(2),
					channels=2,
					rate=44100,
					output=True,
					frames_per_buffer=CHUNK)
					
	# create socket
	message = b'Hello'
	client_socket.sendto(message,(host_ip,port))
	socket_address = (host_ip,port)
	
	def getAudioData():
		while True:
			frame,_= client_socket.recvfrom(BUFF_SIZE)
			q.put(frame)

	t1 = threading.Thread(target=getAudioData, args=())
	t1.start()

	while q.qsize() <= 8: # create a buffer of 5 frames
		pass

	# To ensure there is no lagging in the audio AND each client is at the same point in the song,
	# When the queue is to small, we will write smaller chunks to the stream until the queue is large enough

	pop = False
	print('Now Playing...')
	while True:
		frame = q.get()
		stream.write(frame)

		if q.qsize() < 1:
			print('Buffering...')
			while q.qsize() <= 8:
				pass

		# queue too big, catch up to server by removing frames
		if q.qsize() > 25:
			print("Catching up to server...")
			while q.qsize() > 10:
				q.get()


	client_socket.close()
	print('Audio closed')
	os._exit(1)

def metadata_UDP():
	# create socket for metadata
	client_socket = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
	message = b'Hello'
	client_socket.sendto(message,(host_ip,meta_port))
	socket_address = (host_ip,meta_port)
	
	while True:
		data,addr = client_socket.recvfrom(1024)
		# data is json dump of metadata
		data = data.decode()
		print("New Song:", data)
		pprint(json.loads(data))


# open the streaming port
threading.Thread(target=audio_stream_UDP, args=()).start()
threading.Thread(target=metadata_UDP, args=()).start()

