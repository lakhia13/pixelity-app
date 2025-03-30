// Initialize Channels client
let channels = new Pusher("05c95f5ea947d76ba60f", {
	cluster: "mt1",
});

// Subscribe to the appropriate channel
let channel = channels.subscribe('channel-name');

// Bind a callback function to an event within the subscribed channel
channel.bind('event-name', function (data) {
// Do what you wish with the data from the event
});

async function pushData(data) {
const res = await fetch('/api/channels-event', {
	method: 'POST',
	headers: {
	'Content-Type': 'application/json',
	},
	body: JSON.stringify(data),
});
if (!res.ok) {
	console.error('failed to push data');
}
}