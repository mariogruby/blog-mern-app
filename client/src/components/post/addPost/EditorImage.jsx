import React, { useState } from "react";
import { PinturaEditor } from "@pqina/react-pintura";
import "@pqina/pintura/pintura.css";
import { getEditorDefaults } from "@pqina/pintura";

const editorDefaults = getEditorDefaults({
  stickers: ["😎", "sticker-one.svg", "sticker-two.svg", "sticker-three.svg"],
});

export default function EditorImage({ image, onSave }) {
  const [result, setResult] = useState("");

  const handleProcess = ({ dest }) => {
    const editedImage = new File([dest], image.name, { type: image.type });
    setResult(URL.createObjectURL(editedImage));
    onSave(editedImage);
  };

  return (
    <div style={{ height: "70vh" }}>
      <PinturaEditor
        {...editorDefaults}
        src={image}
        imageCropAspectRatio={1}
        onProcess={handleProcess}
      />
      {result && (
        <p>
          <img src={result} alt="Edited" />
        </p>
      )}
    </div>
  );
}
