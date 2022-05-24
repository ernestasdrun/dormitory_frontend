import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

import '../../App.css'

export default function HomePage() {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    return (
        <div>
            <input type='file' height={10} onChange={onSelectFile} />
            <button onClick={() => console.log(selectedFile)}>TEST</button>
            {<img src={preview} />}
        </div>
    )
}