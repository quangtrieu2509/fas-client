const { io } = require('socket.io-client');

class Socket {
	constructor() {
		this.socket = null;
	}
	connect(token) {
		this.disconnect();
		this.socket = io(process.env.REACT_APP_BASE_SOCKET_URL, {
			withCredentials: true,
			extraHeaders: {
                "Authorization": "Bearer " + token 
            }
		});
        console.log("Socket connected.")
	}
	disconnect() {
		this.socket?.disconnect();
		this.socket = null;
        console.log("Socket disconnected.")
	}

	on(eventName, callback) {
		if (this.socket) {
			this.socket.on(eventName, callback);
		}
	}
	emit(eventName, ...data) {
		if (this.socket) {
			this.socket.emit(eventName, ...data);
		}
	}
	off(eventName, callbackName) {
		if (this.socket) {
			this.socket.off(eventName, callbackName);
		}
	}
}
export const socket = new Socket();