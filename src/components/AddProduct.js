import React, { useState } from "react";
import {
  ref as storageRef,
  getStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { fs } from "../config/Config"; // Ensure 'db' is your initialized Firestore instance

export const AddProduct = () => {
  //   const [title, setTitle] = useState("");
  //   const [description, setDescription] = useState("");
  //   const [price, setPrice] = useState("");
  //   const [image, setImage] = useState(null);

  //   const [imageError, setImageError] = useState("");

  //   const [successMsg, setSuccessMsg] = useState("");
  //   const [uploadError, setUploadError] = useState("");

  //   const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];
  //   const handleProductImg = (e) => {
  //     let selectedFile = e.target.files[0];
  //     if (selectedFile) {
  //       if (selectedFile && types.includes(selectedFile.type)) {
  //         setImage(selectedFile);
  //         setImageError("");
  //       } else {
  //         setImage(null);
  //         setImageError("Please select a valid image file type");
  //       }
  //     } else {
  //       console.log("please select your file");
  //     }
  //   };

  //   const handleAddProducts = (e) => {
  //     e.preventDefault();
  //     const uploadTask = storage.ref("product-images/${image.name}").put(image);
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log(progress);
  //       },
  //       (error) => setUploadError(error.message),
  //       () => {
  //         storage
  //           .ref("product-images")
  //           .child(image)
  //           .getDownload()
  //           .then((url) => {
  //             fs.collection("products").add({
  //               title,
  //               description,
  //               price: Number(price),
  //               url,
  //             });
  //           })
  //           .then(() => {
  //             setSuccessMsg("Product added successfully");
  //             setTitle("");
  //             setDescription("");
  //             setPrice("");
  //             document.getElementById("file").value = "";
  //             setImageError("");
  //             setUploadError("");
  //             setTimeout(() => {
  //               setSuccessMsg("");
  //             }, 3000);
  //           })
  //           .catch((error) => setUploadError(error.message));
  //       }
  //     );
  //   };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

  const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];
  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setImage(selectedFile);
      setImageError("");
    } else {
      setImage(null);
      setImageError("Please select a valid image file type");
    }
  };

  const handleAddProducts = async (e) => {
    e.preventDefault();
    // New storage reference
    const storage = getStorage();
    const fileRef = storageRef(storage, `product-images/${image.name}`);

    try {
      // Upload image
      const fileSnapshot = await uploadBytes(fileRef, image);
      const downloadURL = await getDownloadURL(fileSnapshot.ref);

      // Add new document in Firestore
      await addDoc(collection(fs, "products"), {
        title,
        description,
        price: Number(price),
        url: downloadURL,
      });

      setSuccessMsg("Product added successfully");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      document.getElementById("file").value = "";
      setImageError("");
      setUploadError("");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      setUploadError(error.message);
    }
  };
  return (
    <div className="container">
      <br></br>
      <br></br>
      <h1>Add Products</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className="success-msg">{successMsg}</div>
          <br></br>
        </>
      )}
      <form
        autoComplete="off"
        className="form-group"
        onSubmit={handleAddProducts}
      >
        <label>Product Title</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <br></br>
        <label>Product Description</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></input>
        <br></br>
        <label>Product Price</label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        ></input>
        <br></br>
        <label>Upload Product Image</label>
        <input
          type="file"
          id="file"
          className="form-control"
          required
          onChange={handleProductImg}
        ></input>

        {imageError && (
          <>
            <br></br>
            <div className="error-msg">{imageError}</div>
          </>
        )}
        <br></br>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-success btn-md">
            SUBMIT
          </button>
        </div>
      </form>
      {uploadError && (
        <>
          <br></br>
          <div className="error-msg">{uploadError}</div>
        </>
      )}
    </div>
  );
};
