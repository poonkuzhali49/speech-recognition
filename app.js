// Voice recording functionality
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const audioPlayback = document.getElementById('audioPlayback');
const notesList = document.getElementById('notesList');

let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = e => {
            audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = [];
            saveNote(audioBlob);
        };
        
        mediaRecorder.start();
        recordBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (err) {
        alert('Error accessing microphone: ' + err.message);
    }
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
});

// Note management
function saveNote(audioBlob) {
    const audioUrl = URL.createObjectURL(audioBlob);
    const noteId = Date.now();
    
    // Create note element
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.id = `note-${noteId}`;
    
    noteElement.innerHTML = `
        <audio src="${audioUrl}" controls></audio>
        <button onclick="deleteNote('${noteId}')">Delete</button>
        <span>${new Date(noteId).toLocaleString()}</span>
    `;
    
    notesList.prepend(noteElement);
    
    // In a real app, you would save to localStorage or a backend here
}

function deleteNote(noteId) {
    const noteElement = document.getElementById(`note-${noteId}`);
    if (noteElement) {
        noteElement.remove();
    }
}
