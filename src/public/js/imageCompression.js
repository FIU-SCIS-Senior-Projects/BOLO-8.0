$(function () {

    //This code is incomplete

    //var featuredImage = $('#main');
    var compressedFeatured = $('#compressedFeatured');
    //var compressedOther1 = $('#compressedOther1');
    //var compressedOther2 = $('#compressedOther2');
    var compressedFeaturedPrev = $('#compressedFeaturedPrev');
    //var compressedOther1Prev = $('#compressedOther1Prev');
    //var compressedOther2Prev = $('#compressedOther2Prev');
    /*
    featuredImage.change(function () {
        if (this.files[0]) {
            console.log("Filename:" + this.files[0].name);
            var imageSize = parseInt(this.files[0].size);
            console.log("FileSize:" + (imageSize / 1024) + " Kb");
            compressedFeaturedPrev.empty();
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement("img");
                img.src = e.target.result;
                console.log('Uploaded Image Size: ' + img.src.length * 0.731 / 1024 + ' KiloBytes');
                var newImg, compressionRatio;
                //Compress based on image size
                if ((imageSize / 1024) > 7000) {
                    compressionRatio = 10;
                } else if ((imageSize / 1024) < 500) {
                    compressionRatio = 81;
                } else {
                    compressionRatio = 95 * Math.pow(.99999968, imageSize);
                }
                console.log('compressionRatio: ' + compressionRatio);
                newImg = jic.compress(img, compressionRatio, "jpg");
                console.log('Compressed Image Size: ' + newImg.src.length * 0.731 / 1024 + ' KiloBytes');
                console.log(img);
                console.log(newImg);

                newImg.classList.add("img-responsive");
                compressedFeaturedPrev.append(newImg);
                compressedFeatured.attr('value', newImg.src.split(',')[1]);
            };
            reader.onerror = function (e) {
                console.log("Error: " + e);
            };
            console.log(this.files[0]);
            reader.readAsDataURL(this.files[0]);
        } else {
            compressedFeaturedPrev.empty();
            compressedFeatured.attr('value', '');
        }
    });
    */
});
