var modal = document.getElementById('id01');
function onClickSubmit(id)
{

document.getElementById("id01").style.display = "block";
document.getElementById("id01").style.display="width:auto";

}

function getElementInsideContainer(containerID, childID) {
    var elm = {};
    var elms = document.getElementById(containerID).getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
        if (elms[i].id === childID) {
            elm = elms[i];
            break;
        }
    }
    return elm;
}
