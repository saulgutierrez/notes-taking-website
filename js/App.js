import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

// To create a module for export
export default class App {
    constructor(root) {
        this.notes = []; // List of notes
        this.activeNote = null; // Selected a particular note
        this.view = new NotesView(root, this._handlers()); // Event handler

        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes(); // Fetch the list of all notes present inside the LocalStorage

        this._setNotes(notes); // Set the notes inside the LocalStorage
        // Check if there are one
        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _handlers() {
        return {
            // Check each unique id stored in LocalStorage
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            // Whats happens when click on add button
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };

                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            // What happens when user try to edit a note
            onNoteEdit: (title, body) => { // Fetch the title and the body from the LocalStorage
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                });
                // Display the updated data back on the page
                this._refreshNotes();
            },
            // What happens when the user double clicked over any saved note on the list
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },
        };
    }
}
