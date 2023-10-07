import React, { useEffect, useRef, useState } from "react";
import Excel from "exceljs";

const JSONConverter = () => {
    const [jsonData, setJsonData] = useState(null);
    const [fileName, setFileName] = useState("");
    const [exclude, setExclude] = useState("");
    const fileInputRef = useRef(null);

    // Event handler for file input change
    const handleFileUpload = () => {
        setExclude("");
        const file = fileInputRef.current.files[0];
        if (file) {
            setFileName(file.name.split(".").shift());
            // Read the file as text
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    // Parse the JSON data
                    const parsedData = JSON.parse(event.target.result);
                    const icons = parsedData.icons.map((el) => {
                        let label = el.properties.name.split("-");
                        let labelCapitalize = [];
                        for (const word of label) {
                            labelCapitalize.push(
                                word.charAt(0).toUpperCase() + word.slice(1)
                            );
                        }
                        return {
                            id: el.properties.name,
                            label: labelCapitalize.join(" "),
                        };
                    });
                    setJsonData(icons);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    // Handle JSON parsing error
                }
            };
            reader.readAsText(file);
        }
    };

    const saveAsXLSX = () => {
        if (jsonData) {
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet("Icons");

            worksheet.columns = [
                {
                    header: "Id",
                    key: "Id",
                    width: 30,
                },
                {
                    header: "Label",
                    key: "Label",
                    width: 30,
                },
            ];

            jsonData.map((icon) => {
                worksheet.addRow({
                    Id: icon.id,
                    Label: icon.label,
                });
            });
            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = fileName + ".xlsx";
                anchor.click();
                window.URL.revokeObjectURL(url);
            });
        }
    };

    /* Exclude data */
    const handleExcludeChange = (e) => {
        setExclude(e.target.value);
    };
    const handleExclude = () => {
        setJsonData((prev) =>
            prev.filter((icon) => !icon.id.includes(exclude))
        );
    };

    return (
        <div className="json">
            <div className="form-group">
                <label htmlFor="file-upload">Upload the JSON file</label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
            </div>
            {jsonData && (
                <div className="json__result">
                    <div className="json__header">
                        <h2>Number of icons: {jsonData.length} </h2>
                        <div className="json__actions">
                            <button className="xlsx" onClick={saveAsXLSX}>
                                Export xlsx
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exclude">Exclude</label>
                        <div className="input-btn">
                            <input
                                id="exclude"
                                type="text"
                                className="form-control"
                                value={exclude}
                                onChange={handleExcludeChange}
                            />
                            <button
                                className="reset"
                                onClick={handleFileUpload}
                            >
                                reset
                            </button>
                            <button onClick={handleExclude}>exclude</button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Label</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jsonData.map((icon) => {
                                return (
                                    <tr>
                                        <td> {icon.id} </td>
                                        <td>{icon.label} </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default JSONConverter;
