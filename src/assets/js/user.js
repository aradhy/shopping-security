
var modal = document.getElementById('id01');
function onClickSubmit(id)
{


if(id=='signUp')
{
$("#signUpId").show();
$("#signInId").hide();
}
else{
    $("#signInId").show();
    $("#signUpId").hide();
}
}

function onClick(id)
{

if(id=='signUp')
{
$("#signUpId").show();
$("#signInId").hide();
}
else{
    $("#signInId").show();
    $("#signUpId").hide();
}
}
