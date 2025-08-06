import { notesData } from './notesData.js';

// ========== Komponen: App Bar ==========
class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Aplikasi Catatan</h1>`;
  }
}
customElements.define('app-bar', AppBar);

// ========== Komponen: Note Item ==========
class NoteItem extends HTMLElement {
  set note(value) {
    this._note = value;
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="note-card">
        <h3>${this._note.title}</h3>
        <p>${this._note.body}</p>
        <small>Dibuat: ${new Date(this._note.createdAt).toLocaleString()}</small>
      </div>
    `;
    this.classList.add('note-item');
  }
}
customElements.define('note-item', NoteItem);

// ========== Komponen: Note Form ==========
class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <form id="add-note-form">
        <input type="text" id="note-title" placeholder="Judul catatan" required />
        <br /><br />
        <textarea id="note-body" placeholder="Isi catatan" required></textarea>
        <br /><br />
        <button type="submit">Tambah Catatan</button>
      </form>
    `;

    this.querySelector('#add-note-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = this.querySelector('#note-title').value;
      const body = this.querySelector('#note-body').value;

      this.dispatchEvent(new CustomEvent('note-added', {
        detail: { title, body },
        bubbles: true,
      }));

      this.querySelector('#note-title').addEventListener('input', (e) => {
        if (e.target.value.trim() === '') {
          e.target.style.borderColor = 'red';
        } else {
          e.target.style.borderColor = '#ccc';
        }
      });

      this.querySelector('#note-body').addEventListener('input', (e) => {
        if (e.target.value.trim() === '') {
          e.target.style.borderColor = 'red';
        } else {
          e.target.style.borderColor = '#ccc';
        }
      });

    });
  }
}
customElements.define('note-form', NoteForm);

// ========== Main Script ==========
const noteList = document.getElementById('note-list');

function renderNotes(notes) {
  noteList.innerHTML = '';
  notes.forEach(note => {
    const item = document.createElement('note-item');
    item.note = note;
    noteList.appendChild(item);
  });
}

renderNotes(notesData);

document.body.addEventListener('note-added', (e) => {
  const newNote = {
    id: `notes-${Date.now()}`,
    title: e.detail.title,
    body: e.detail.body,
    createdAt: new Date().toISOString(),
    archived: false
  };
  notesData.unshift(newNote);
  renderNotes(notesData);
});
