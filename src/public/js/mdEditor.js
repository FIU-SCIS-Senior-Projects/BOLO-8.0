window.onload = function () {
    var converter = new showdown.Converter();
    var textInputBox = document.getElementsByName('in')[0];
    var markdownArea = document.getElementById('markdown');
   
    var convertTextAreaToMarkdown = function () {
        console.log("convertTextAreaToMarkdown");
        var markdownText = '';
        markdownText = textInputBox.value;
        markdownArea.innerHTML = converter.makeHtml(markdownText)
    };

  

    textInputBox.addEventListener('change', convertTextAreaToMarkdown);
  
    convertTextAreaToMarkdown();
  
};

