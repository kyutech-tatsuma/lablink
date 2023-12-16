import React from "react";
import { useState, useEffect } from "react";
import "./../Simplechat/chatbot.css";
import Imagegeneratorchat from "./imagegeneratechat";

const Imagegeneratorcontent = ({ setmenu, baseurl, setshowfooter}) => {
    const [showchatbot, setShowchatbot] = useState(false);

    const createimage = () => {
        setmenu(false);
        setShowchatbot(true);
    }

    useEffect(() => {
        if (showchatbot) {
            setshowfooter(false);
        } else {
            setshowfooter(true);
        }
    }, [showchatbot]);


    return (
        <div className="container my-3">
            <div className="row">
                <h3 className="text-center mb-4">Image Generator</h3>
                <div className="d-flex justify-content-center mb-4"> 
                    <button type="button" className="btn btn-primary text-white" onClick={createimage}>Create Image</button>
                </div>
                {showchatbot && <Imagegeneratorchat setmenu={setmenu} baseurl={baseurl} setShowchatbot={setShowchatbot}/>}
            </div>
        </div>
    );
}

export default Imagegeneratorcontent;