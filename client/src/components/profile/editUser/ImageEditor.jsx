import React, { useState } from "react";
import { PinturaEditor } from "@pqina/react-pintura";
import "@pqina/pintura/pintura.css";
import { getEditorDefaults } from '@pqina/pintura';

const editorDefaults = getEditorDefaults();

export default function EditorImage({ image, onSave }) {
    const handleProcess = ({ dest }) => {
        const editedImage = new File([dest], image.name, { type: image.type });
        onSave(editedImage);
    };

    return (
        <div style={{ height: "70vh" }}>
            <PinturaEditor
                {...editorDefaults}
                src={URL.createObjectURL(image)}
                onProcess={handleProcess}
                imageCropAspectRatio={1}
                willRenderCanvas={(shapes, state) => {
                    const {
                        utilVisibility,
                        selectionRect,
                        lineColor,
                        backgroundColor,
                    } = state;

                    if (utilVisibility.crop <= 0) return shapes;

                    const { x, y, width, height } = selectionRect;

                    return {
                        ...shapes,
                        interfaceShapes: [
                            {
                                x: x + width * 0.5,
                                y: y + height * 0.5,
                                rx: width * 0.5,
                                ry: height * 0.5,
                                opacity: utilVisibility.crop,
                                inverted: true,
                                backgroundColor: [...backgroundColor, 0.5],
                                strokeWidth: 1,
                                strokeColor: [...lineColor],
                            },
                            ...shapes.interfaceShapes,
                        ],
                    };
                }}
            />
        </div>
    )
}
