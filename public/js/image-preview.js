function previewFile(){
    var previewImg = document.getElementById("image_preview__image");
    var previewText = document.getElementById("image_preview__default_text");
    var file = document.querySelector("input[type=file]").files[0];

    var reader = new FileReader();

    reader.onloadend = function() {
        previewImg.src = reader.result;
    }
    if(file) {
        previewImg.style.display = "block";
        previewText.style.display = "none";
        reader.readAsDataURL(file);
    } else {
        previewImg.src = "";
    }
}
