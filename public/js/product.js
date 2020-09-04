function Product() {
    function bindEvent() {
        $(".product_edit").click(function() {
            var params = {
                id: $(".product_id").val(),
                name: $(".product_name").val(),
                prices: $(".product_prices").val(),
                description: $(".product_description").val(),
                category: $(".product_category").val(),
                author: $(".product_author").val(),
            };
            var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            $.ajax({
                url: base_url + '/admin/products/edit',
                type: 'PUT',
                data: params,
                dataType: 'json',
                success: function(res) {
                    if(res && res.status_code == 200) {
                        alert("Da luu vao co so du lieu");
                        window.location.href = base_url + '/admin/products';
                    }
                }
            });
        });
        $(".product_delete").click(function() {
            var pdId = $(this).attr("product_id");
            var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            $.ajax({
                url: base_url + '/admin/products/delete',
                type: 'DELETE',
                data: { id: pdId },
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
    new Product();
})