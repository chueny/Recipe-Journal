import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import API from "../../utils/API"
import ls from "local-storage";
import { genImgFileName, dataURLtoFile, imgUploadHandler } from "../../utils/CameraLogic";
import Webcam from "react-webcam";

function AllDone() {

    const desktop = navigator.appVersion.indexOf("Win") ? true :
        navigator.appVersion.indexOf("Mac") ? true :
            navigator.appVersion.indexOf("X11") ? true :
                navigator.appVersion.indexOf("Linux") ? true :
                    false

    const webcamRef = React.useRef(null);

    // what about dates? does this page help track dates?
    const [imgSrc, setImgSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [mode, setMode] = useState("select");
    const [url, setUrl] = useState();
    const [comment, setComment] = useState("");
    const [recipe, setRecipe] = useState(ls.get("recipe"));
    const history = useHistory();

    useEffect(() => {
        console.log(comment);
        return () => {
            API.updateRecipe(recipe._id, recipe).then(() => {
                console.log("recipe successfully written");
            })
        }
    }, [])

    const webcamCapture = React.useCallback(async () => {
        // console.log("webcamCapture");
        setMode("preview")
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        const filename = genImgFileName(recipe.name);
        // console.log("webcamCapture filename", filename);
        const jpgImage = dataURLtoFile(imageSrc, filename);
        // console.log("webcamCapture jpgImage", jpgImage);
        const downloadURL = await imgUploadHandler(jpgImage, filename, recipe.userID);
        // console.log("downloadURL", downloadURL);
        setUrl(downloadURL);
    }, [webcamRef, setImgSrc]);

    const localfileSelectedHandler = async event => {
        setMode("file");
        const jpgImage = event.target.files[0];
        setFile(jpgImage);
        //validate jpg png etc
        //bootstrap popdown validator
        const filename = genImgFileName(recipe.name);
        //needs validation logic to ensure a picture file is selected
        const downloadURL = await imgUploadHandler(jpgImage, filename, recipe.userID);
        // console.log("downloadURL", downloadURL);
        setUrl(downloadURL);
    }

    const captureMode = () => {
        switch (mode) {
            case "select":
                setMode("capture");
                return;
            case "capture":
                setMode("preview");
                return;
        }
    }

    const submitForms = (route) => {
        let comments = recipe.comments;
        let urls = recipe.imageUrls;
        comments.push(comment);
        //  urls.push(url);
        urls[0] = url;
        // setting and uploading the photo logic goes here
        setRecipe({ ...recipe, comments: comments, imageUrls: urls });
        switch (route) {
            case "HOME":
                history.push('/recipebox');
                return;
            case "EDIT":
                history.push('/create/info');
                return;
        }
    }

    const onChange = (e) => {
        setComment({ ...comment, text: e.target.value });
    }

    const onComplete = (e) => {
        e.preventDefault();
        console.log("Hello OnSubmit");
    }

    return (
        <>
            <h1 className="display-2 font-brand display-3-small mb-0">all done!</h1>

            {mode === "capture" ?
                <>
                    <span className="divider-color"></span>
                    <section className="webcam text-center">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                        />
                        <button className="rb-btn btn-info w-100 my-3" type="button" onClick={webcamCapture}>
                            Capture photo
                        </button>
                    </section>
                </> :
                mode === "preview" ?
                    <>
                        <span className="divider-color"></span>
                        <section>
                            {imgSrc && (
                                <img
                                    src={imgSrc} alt="webcam screenshot"
                                />
                            )}
                        </section>
                    </> :
                mode === "file" ?
                    <div className="font-sans text-center divider mx-2 my-0">
                        <span className="font-weight-normal pr-1">File Selected:</span>{file.name}
                    </div>
                    : 
                <span className="divider-color"></span>}

            <form onSubmit={e => onComplete(e)}>

                {mode === "select" ? <div className="d-flex">
                    {desktop ?
                        <button className="rb-btn flex-fill" onClick={captureMode}>
                            Use Webcam
                    </button>
                        : null}
                    {/* Take out flex-fill below for mobile */}
                    <div className={desktop ? "form-file form-tweak ml-2" : "form-file form-tweak flex-fill"}>
                        <input
                            type="file"
                            accept=".jpg,.png"
                            className="form-file-input h-100"
                            id="filePhoto"
                            onChange={localfileSelectedHandler}
                        />
                        <label className="form-file-label font-book-italic h-100 text-center d-flex align-items-center">
                            <div className="form-file-text rb-btn-form h-100 form-tweak">{desktop ? "Upload a photo..." : "Take a photo..."}</div>
                            {/* <span className="form-file-button">Browse</span> */}
                        </label>
                    </div>
                </div> : null}
                <div className="form-group">
                    <label className="font-book-italic mt-2">Comments:</label>
                    <textarea
                        type="text"
                        required
                        className="form-control"
                        name="comments"
                        // value={recipe.comment}
                        onChange={e => onChange(e)}
                    />
                </div>
            </form>
            <div className="d-flex justify-content-between">
                <button
                    type="button"
                    onClick={() => submitForms("EDIT")}
                    className="rb-btn btn-warning mt-3 mr-1"
                >Edit Recipe</button>
                <button
                    type="button"
                    onClick={() => submitForms("HOME")}
                    className="rb-btn btn-info mt-3 ml-1"
                >Return to Recipe Box</button>
            </div>
        </>
    )
}

export default AllDone;