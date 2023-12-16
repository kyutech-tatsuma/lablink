import React from "react";
import { MdOutlineAttachFile } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { useState } from "react";
import "./Imagegen.css";
import axios from "axios";
import './../../PaperSummary/Papsum.css';

const Imagegeneratorchat = ({ setmenu, baseurl, setShowchatbot }) => {
    const [loading, setloading] = useState(false);
    const [question, setQuestion] = useState("");
    const [numImages, setNumImages] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [generatedImages, setGeneratedImages] = useState([]);

    const handleQuestionSubmit = async () => {
        setloading(true);
        // ファイルが選択されていない場合
        try {
            const response = await axios.post(`${baseurl}imageprocess/generate`, {
                prompt: question,
                num_images: numImages,
            });

            console.log(response);

            if (response.status === 200) {
                setGeneratedImages(response.data);
            } else {
                console.error("Failed to generate image");
            }
        } catch (error) {
            console.error("Error generating images:", error);
        }
        setloading(false);
    };

    const backtomenu = () => {
        setShowchatbot(false);
        setmenu(true);
    }

    return (
        <>
        { loading && 
                <div className="overlay" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="my-container">
                    <span></span>
                    <span></span>
                    <span></span>
                    <p>お絵描き中</p>
                </div>
            </div> 
            }
            <div className="back-to-menu">
                <button className="btn btn-secondary" onClick={backtomenu}>
                    Back to Menu
                </button>
            </div>
            <div className="images-display">
                {generatedImages.map((image, index) => (
                    <div key={index}>
                        <img src={image.url} alt={`Generated ${index}`} />
                        <a href={image.url} download={`generated_image${index + 1}.png`}>
                            Download Image {index + 1}
                        </a>
                        <p>{image.revised_prompt}</p>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <textarea
                    className="form-control"
                    id="questionInput"
                    rows="1"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                ></textarea>
                <input
                    type="number"
                    className="form-control num-images-input"
                    value={numImages}
                    onChange={(e) => setNumImages(e.target.value)}
                    min="1"
                    max="5"
                />
            </div>
            <button className="btn btn-primary send-button" onClick={handleQuestionSubmit}>
                <IoMdSend />
            </button>
        </>
    );
};

export default Imagegeneratorchat;