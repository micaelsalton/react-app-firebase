import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

        React.useEffect(() => {
            const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
                // Sync up our local notes array with the snapshot data
                const notesArr = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }))
                setNotes(notesArr)
            })
            return unsubscribe
        }, [])

        React.useEffect(() => {
            if (currentNoteId) {
                setCurrentNoteId(notes[0]?.id)
            }
        }, [notes])

        React.useEffect(()=> {
            currentNote && setTempNoteText(currentNote.body)        
        },[currentNote])

        React.useEffect(() => {
            const timeoutId = setTimeout(() => {
                tempNoteText !== currentNote.body && updateNote(tempNoteText)
            }, 500)
            return () => clearTimeout(timeoutId)
        }, [tempNoteText])

        async function createNewNote() {
            const newNote = {
                body: `New note`,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
            const newNoteRef = await addDoc(notesCollection, newNote)
            setCurrentNoteId(newNoteRef.id)
        }

    async function updateNote(text) {
        const docRef = doc(db, "react-notes-fire", currentNoteId)
        await setDoc(docRef, { body: text, createdAt: Date.now(), updatedAt: Date.now() }, { merge: true })
    }

    async function deleteNote(noteId) {
       const docRef = doc(db, "react-notes-fire", noteId)
       await deleteDoc(docRef)
    }

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
