const imageInput = document.getElementById("image-input");
const removeBtn = document.getElementById("remove-btn");
const resultImage = document.getElementById("result-image");
const downloadLink = document.getElementById("download-link");
const loadingContainer = document.getElementById("loading-container");

const port = 8080;

removeBtn.addEventListener("click", async () => {
    const file = imageInput.files[0]

    if (!file) {
        alert("Please select an image first!");
        return;
    }

    removeBtn.disabled = true;
    removeBtn.innerText = "Processing...";
    loadingContainer.style.display = "block";
    resultImage.style.opacity = "0.5";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`http://localhost:${port}/remove-bg`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Server error");

        const blob = await response.blob();

        if (resultImage.src) URL.revokeObjectURL(resultImage.src);

        const imageURL = URL.createObjectURL(blob);

        resultImage.src = imageURL;
        resultImage.style.opacity = "1";
        downloadLink.href = imageURL;
        downloadLink.style.display = "inline";
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Something went wrong while processing the image.");
    } finally {
        removeBtn.disabled = false;
        removeBtn.innerText = "Remove Background";
        loadingContainer.style.display = "none";
    }
})