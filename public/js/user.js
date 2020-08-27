function User() {
    function bindEvent() {
        $(".user_delete").click(function() {
            var userId = $(this).attr("user_id");
            var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            $.ajax({
                url: base_url + '/admin/users/delete',
                type: 'DELETE',
                data: { id: userId },
                dataType: 'json',
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