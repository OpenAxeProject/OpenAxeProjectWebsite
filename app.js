    function copy(id) {
        var text = document.getElementById(id).innerText;
        navigator.clipboard.writeText(text).then(() => {
            showToast();
        }).catch(err => {
            console.error('Failed to copy', err);
        });
    }

    function showToast() {
        var t = document.getElementById("toast");
        t.className = "show";
        setTimeout(function(){ t.className = t.className.replace("show", ""); }, 3000);
    }