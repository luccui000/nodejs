function User() {
    function bindEvent() {
        $(".user_edit").click(function() {
            
            var params = {
                id: $(".id").val(),
                email: $(".email").val(),
                role:  $("#addRole option:selected").text()             
            }; 
            var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            $.ajax({
                url: base_url + "/admin/users/edit/",
                type: "PUT",
                data: params,
                dataType: "json",
                success: function(res) {
                    if(res && res.status_code == 200) {
                        location.reload();
                    }
                }
            });
        });
    }
    bindEvent();
}
$(document).ready(function() {
    new User();
})
