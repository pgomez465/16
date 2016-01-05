import io		from 'socket.io-client';
import $		from 'jquery';

window.$ = $;

const socket = io();
window.socket = socket;

/*
Events:
- On server message recieved:
	- Add message to display
*/

// Elements
const $chatHeader		= $('#chat-header');
const $chatMessages		= $('#chat-messages');
const $chatMessage		= $('#chat-message');
const $chatSend			= $('#chat-send');

/**
 * Adds a chat message to the messages list.
 * @param {string} message - The message to add.
 * @param {bool} isMine - True if the message is from the client, false if from server.
 */
function addChatMessage(message, isMine) {
	return $chatMessages.append(`<div class="message ${isMine ? 'mine pending' : 'theirs'}">${message}</div>`);
}

///////////////////////////////////////
// Event Handlers

/**
 * Sends a message from the client.
 * @param {string} message - The message to send.
 */
function sendMessage(message) {
	// Add the message to the local display
	const $msg = addChatMessage(message, true);

	// Send the message to the server
	socket.emit('chat', message, () => {
		// Remove the pending class once the message is acknowledged
		// by the remote client
		$msg.removeClass('pending');
	});
}

/**
 * Recieves a message from the server.
 * @param {string} message - The message from the server.
 */
function recieveMessage(message) {
	addChatMessage(message, false);
}

///////////////////////////////////////
// Wire up the handlers

// Send messages
$chatSend.click(() => {
	const message = $chatMessage.val();
	$chatMessage.val('');
	sendMessage(message);
});

// Receive messages
socket.on('chat', (message) => {
	recieveMessage(message);
});
