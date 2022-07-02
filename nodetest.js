import screenfull from 'screenfull';

document.getElementById('button').addEventListener('click', () => {
	if (screenfull.isEnabled) {
		screenfull.request();
	} else {
		// Ignore or do something else
	}
});